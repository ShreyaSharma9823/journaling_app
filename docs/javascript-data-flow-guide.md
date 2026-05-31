# JavaScript Data Flow Guide For This Journal App

## Big Picture

The JavaScript in [`templates/page.html`](C:/Users/hp/Desktop/python_project_file/dreamboard/dreamproject/templates/page.html) connects:

1. the browser UI
2. the Django API
3. the database

The browser does not save journals directly. It only collects values from the page and sends them to Django. Django validates that data and saves it through the serializer and model.

Save flow:

1. User types title, date, and content.
2. `saveData()` reads those values from the page.
3. `toIsoStringFromLocalInput()` converts the date into a standard format.
4. `JSON.stringify()` converts the JavaScript object into JSON text.
5. `fetch('/api/journals/', ...)` sends it to Django.
6. The serializer parses the datetime.
7. The model saves the row in the database.

Read flow:

1. `loadJournals()` sends a GET request.
2. Django returns only the logged-in user's journals.
3. `renderJournalList()` builds the sidebar UI.
4. Clicking an item loads its data back into the editor.

## Why JSON Is Used

JSON is not the database.

JSON is just the format used to send structured data between the browser and Django over HTTP.

Example payload:

```json
{
  "journal_title": "My day",
  "journal_description": "<p>Hello</p>",
  "journal_date": "2026-04-08T09:30:00.000Z"
}
```

So:

- JavaScript creates the object
- JSON carries it over the network
- Django saves it in models

## JavaScript Functions

### `getCookie(name)`

Why:
- Django requires a CSRF token for POST and DELETE requests.

How:
- Reads `document.cookie`
- Finds `csrftoken`
- Sends it in request headers

### `toDateTimeLocalValue(dateValue)`

Why:
- The API returns an ISO datetime
- `<input type="datetime-local">` wants a local browser-style value

How:
- Creates a `Date`
- Adjusts for timezone offset
- Returns `YYYY-MM-DDTHH:mm`

### `toIsoStringFromLocalInput(dateValue)`

Why:
- The browser input is local time
- The API should receive a clean ISO timestamp
- If the user leaves it blank, current time should be used

How:
- If blank: `new Date().toISOString()`
- If filled: convert chosen local time into ISO UTC string

### `resetEditor()`

Why:
- Needed when creating a fresh journal

How:
- Clears title
- Clears date
- Clears editor
- Removes selected journal id

### `renderJournalList(journals)`

Why:
- API data must become clickable UI

How:
- Builds sidebar items
- Adds open button click events
- Adds delete button click events
- Loads selected journal into the form

### `loadJournals(searchValue = '')`

Why:
- Loads journals when page opens
- Reloads after save or delete

How:
- Builds the API URL
- Calls `fetch()`
- Parses JSON with `response.json()`
- Sends result to `renderJournalList()`

### `deleteJournal(journalId)`

Why:
- Removes a saved journal

How:
- Confirms with user
- Sends a `DELETE` request
- Reloads the list

### `saveData()`

Why:
- Main save function

How:
- Reads title, date, and editor content
- Validates title
- Builds a JavaScript object
- Uses `JSON.stringify()`
- Sends a POST request
- Reloads the sidebar after success

## How Date Handling Works Now

You wanted:

- if user gives a date, save that date
- if user gives no date, use current date/time

That is now handled like this:

- frontend sends the selected date
- if nothing is selected, frontend sends current datetime
- backend still has its own default as a safety net

## Authentication In Your Project

Authentication means: "Who is the user?"

Django is handling that in [`dreamproject/views.py`](C:/Users/hp/Desktop/python_project_file/dreamboard/dreamproject/dreamproject/views.py).

What is happening:

- On signup, Django creates a user using `User.objects.create_user(...)`
- On login, Django checks the credentials using `authenticate(...)`
- If correct, Django starts the session using `login(request, user)`
- On logout, Django clears the session using `logout(request)`

Important pieces:

- `authenticate(...)`
  Checks username/email and password

- `login(request, user)`
  Marks the user as logged in and creates a session

- `request.user`
  Gives you the current logged-in user on later requests

## Authorization In Your Project

Authorization means: "What is this user allowed to do?"

That is happening mainly in two places.

### 1. Page protection

In [`dreamproject/views.py`](C:/Users/hp/Desktop/python_project_file/dreamboard/dreamproject/dreamproject/views.py), the journal page uses:

```python
@login_required(login_url='index')
```

That means:

- if not logged in, user cannot access `/page/`
- Django redirects them to the login page

### 2. API protection

In [`journals/views.py`](C:/Users/hp/Desktop/python_project_file/dreamboard/dreamproject/journals/views.py), the API uses:

```python
permission_classes = [IsAuthenticated]
```

That means:

- only logged-in users can call the journal API
- anonymous users are blocked

And this line is the data ownership rule:

```python
Journal_uploaded.objects.filter(owner=self.request.user)
```

That means:

- each user only sees their own journals
- not someone else's journals

And on create:

```python
serializer.save(owner=self.request.user)
```

That means:

- the logged-in user becomes the owner automatically
- frontend does not choose the owner

This is good because users should never be allowed to send `owner` manually.

## CSRF Protection

For save and delete requests, your frontend sends:

- `X-CSRFToken`

That works with Django's CSRF middleware and helps protect authenticated actions from malicious cross-site requests.

## Resources

- MDN Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN `JSON.stringify()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
- MDN `Date`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- MDN `toISOString()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
- MDN `datetime-local`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/datetime-local
- MDN `addEventListener()`: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- DRF fields: https://www.django-rest-framework.org/api-guide/fields/
- DRF serializers: https://www.django-rest-framework.org/api-guide/serializers/
- Django model fields: https://docs.djangoproject.com/en/5.2/ref/models/fields/
- Django CSRF: https://docs.djangoproject.com/en/5.2/ref/csrf/

## Small Practice Projects

1. Notes app
2. Task manager
3. Expense tracker
4. Movie watchlist
5. Journal with edit history

## Final Takeaway

Your frontend prepares and sends data.

Django handles:

- authentication
- authorization
- validation
- ownership
- database saving

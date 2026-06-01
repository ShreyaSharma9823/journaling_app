var Font = Quill.import('formats/font');

Font.whitelist = [
  'poppins',
  'roboto',
  'playfair',
  'lobster',
  'montserrat',
  'Times New Roman'
];

Quill.register(Font, true);

var quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: '#toolbar'
  }
});

const createEntryButton = document.getElementById('create_entry_btn');
const saveJournalButton = document.getElementById('save_journal_btn');
const searchInput = document.getElementById('journal_search');
const journalList = document.getElementById('journal_list');
const journalTitleInput = document.getElementById('journal_title');
const journalDateInput = document.getElementById('journal_date');
let selectedJournalId = null;

function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));

  return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
}

function toDateTimeLocalValue(dateValue) {
  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

function toIsoStringFromLocalInput(dateValue) {
  if (!dateValue) {
    return new Date().toISOString();
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function resetEditor() {
  selectedJournalId = null;
  journalTitleInput.value = '';
  journalDateInput.value = '';
  quill.setContents([]);
  quill.focus();
}

function renderJournalList(journals) {
  if (!journals.length) {
    journalList.innerHTML = '<p class="empty_state">No journals found.</p>';
    return;
  }

  journalList.innerHTML = journals.map(journal => {
    return `
      <div class="journal_list_item" data-id="${journal.id}">
        <button type="button" class="journal_open_btn" data-id="${journal.id}">
          <span class="journal_card_title">${journal.journal_title}</span>
        </button>
        <button type="button" class="journal_delete_btn" data-id="${journal.id}">Delete</button>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.journal_open_btn').forEach(card => {
    card.addEventListener('click', function () {
      const journalId = this.dataset.id;
      const selectedJournal = journals.find(journal => String(journal.id) === journalId);

      if (!selectedJournal) {
        return;
      }

      selectedJournalId = selectedJournal.id;
      journalTitleInput.value = selectedJournal.journal_title;
      journalDateInput.value = toDateTimeLocalValue(selectedJournal.journal_date);
      quill.root.innerHTML = selectedJournal.journal_description || '';
    });
  });

  document.querySelectorAll('.journal_delete_btn').forEach(button => {
    button.addEventListener('click', function () {
      deleteJournal(this.dataset.id);
    });
  });
}

function loadJournals(searchValue = '') {
  const query = searchValue.trim();
  const url = query ? `/api/journals/?search=${encodeURIComponent(query)}` : '/api/journals/';

  fetch(url)
    .then(async response => {
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error('Failed to load journals.');
      }
      return data;
    })
    .then(data => {
      renderJournalList(data);
    })
    .catch(error => {
      console.error('Error:', error);
      journalList.innerHTML = '<p class="empty_state">Unable to load journals.</p>';
    });
}

function deleteJournal(journalId) {
  if (!confirm('Delete this journal permanently?')) {
    return;
  }

  fetch(`/api/journals/${journalId}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete journal.');
      }

      if (selectedJournalId === Number(journalId)) {
        resetEditor();
      }

      loadJournals(searchInput.value);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Delete failed: ' + error.message);
    });
}

function saveData() {
  const title = journalTitleInput.value.trim();
  const date = journalDateInput.value;
  const description = quill.root.innerHTML;

  if (!title) {
    alert('Please enter a journal title.');
    return;
  }

  const isEditing = selectedJournalId !== null;
  const url = isEditing ? `/api/journals/${selectedJournalId}/` : '/api/journals/';
  const method = isEditing ? 'PATCH' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({
      journal_title: title,
      journal_description: description,
      journal_date: toIsoStringFromLocalInput(date)
    })
  })
    .then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.detail || data.non_field_errors?.[0] || data.journal_title?.[0] || JSON.stringify(data) || 'Failed to save journal.';
        throw new Error(message);
      }
      return data;
    })
    .then(data => {
      console.log('Success:', data);
      selectedJournalId = data.id;
      alert(isEditing ? 'Journal updated successfully.' : 'Journal saved successfully.');
      loadJournals(searchInput.value);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Save failed: ' + error.message);
    });
}

searchInput.addEventListener('input', function () {
  loadJournals(this.value);
});

createEntryButton.addEventListener('click', resetEditor);
saveJournalButton.addEventListener('click', saveData);

resetEditor();
loadJournals();

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie

def index(request):
    if request.method == 'GET' and request.user.is_authenticated:
        logout(request)

    context = {}

    if request.method == 'POST':
        action = request.POST.get('action')
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip().lower()
        password = request.POST.get('password', '')

        context['entered_username'] = username
        context['entered_email'] = email

        if action == 'signup':
            if not username or not email or not password:
                context['error'] = 'Username, email, and password are required.'
            elif User.objects.filter(email__iexact=email).exists():
                context['error'] = 'An account with this email already exists.'
            elif User.objects.filter(username__iexact=username).exists():
                context['error'] = 'This username is already taken.'
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                login(request, user)
                return redirect('page')
        elif action == 'login':
            login_identifier = email or username

            if not login_identifier or not password:
                context['error'] = 'Enter your email or username and password to log in.'
            else:
                authenticated_user = authenticate(request, username=login_identifier, password=password)

                if authenticated_user is None:
                    user = User.objects.filter(email__iexact=login_identifier).first()

                    if user:
                        authenticated_user = authenticate(request, username=user.username, password=password)

                if authenticated_user is None:
                    context['error'] = 'Invalid email or password.'
                else:
                    login(request, authenticated_user)
                    return redirect('page')

    return render(request, 'index.html', context)

@login_required(login_url='index')
@ensure_csrf_cookie
def page(request):
    return render(request, 'page.html')

@login_required(login_url='index')
def guide(request):
    return render(request, 'guide.html')

def logout_view(request):
    logout(request)
    return redirect('index')

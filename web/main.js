import { AdminDashboard } from './components/AdminDashboard.js';
import { ProviderDashboard } from './components/ProviderDashboard.js';
import { CaseManagerDashboard } from './components/CaseManagerDashboard.js';
import { LoginPage } from './components/LoginPage.js';

class App {
    constructor() {
        this.currentUser = null;
        this.currentView = 'login';
        this.render();
    }

    login(user) {
        this.currentUser = user;
        this.currentView = this.getDashboardForRole(user.role);
        this.render();
    }

    logout() {
        this.currentUser = null;
        this.currentView = 'login';
        this.render();
    }

    getDashboardForRole(role) {
        switch (role) {
            case 'admin': return 'admin';
            case 'provider': return 'provider';
            case 'case_manager': return 'case_manager';
            default: return 'login';
        }
    }

    render() {
        const root = document.getElementById('root');
        
        switch (this.currentView) {
            case 'login':
                root.innerHTML = LoginPage(this.login.bind(this));
                break;
            case 'admin':
                root.innerHTML = AdminDashboard(this.currentUser, this.logout.bind(this));
                break;
            case 'provider':
                root.innerHTML = ProviderDashboard(this.currentUser, this.logout.bind(this));
                break;
            case 'case_manager':
                root.innerHTML = CaseManagerDashboard(this.currentUser, this.logout.bind(this));
                break;
        }
    }
}

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
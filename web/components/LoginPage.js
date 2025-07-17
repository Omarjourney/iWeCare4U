export function LoginPage(onLogin) {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <div class="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Healthcare Platform
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        HIPAA-compliant healthcare management system
                    </p>
                </div>
                
                <div class="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
                    <form class="space-y-6" id="loginForm">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div class="mt-1">
                                <input id="email" name="email" type="email" required
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your email">
                            </div>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div class="mt-1">
                                <input id="password" name="password" type="password" required
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your password">
                            </div>
                        </div>

                        <div>
                            <label for="role" class="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <div class="mt-1">
                                <select id="role" name="role" required
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">Select your role</option>
                                    <option value="admin">Administrator</option>
                                    <option value="provider">Healthcare Provider</option>
                                    <option value="case_manager">Case Manager</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input id="mfa" name="mfa" type="checkbox"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                <label for="mfa" class="ml-2 block text-sm text-gray-900">
                                    Use MFA (recommended)
                                </label>
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                                    </svg>
                                </span>
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div class="mt-6">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-gray-300"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-2 bg-white text-gray-500">Demo Credentials</span>
                            </div>
                        </div>
                        
                        <div class="mt-4 space-y-2 text-sm text-gray-600">
                            <div class="flex justify-between">
                                <span>Admin:</span>
                                <span class="text-gray-900">admin@healthcare.com</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Provider:</span>
                                <span class="text-gray-900">provider@healthcare.com</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Case Manager:</span>
                                <span class="text-gray-900">case@healthcare.com</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Password:</span>
                                <span class="text-gray-900">demo123</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const role = formData.get('role');
                
                // Simple demo authentication
                if (email && role) {
                    const user = {
                        id: '1',
                        email: email,
                        role: role,
                        name: role === 'admin' ? 'Admin User' : 
                              role === 'provider' ? 'Dr. Smith' : 
                              'Case Manager'
                    };
                    
                    // Dispatch custom event
                    window.dispatchEvent(new CustomEvent('login', { detail: user }));
                }
            });
        }
    }, 100);
});
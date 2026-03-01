export class SessionManager {
  private static readonly SESSION_KEY = 'user_session_id';

  static createSession(): string {
    // Generate a timestamp-based ID with random elements
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sessionId = `${timestamp}-${randomStr}`;
    
    localStorage.setItem(this.SESSION_KEY, sessionId);
    return sessionId;
  }

  static getSessionId(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }

  static hasActiveSession(): boolean {
    return !!this.getSessionId();
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
}
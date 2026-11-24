import { Component, OnInit, signal } from '@angular/core';
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

@Component({
  template: ` <p>{{ message() }}</p> `,
})
export class MicrosoftAuth implements OnInit {
  readonly message = signal('Conectando ao Microsoft To Do…');

  ngOnInit() {
    void broadcastResponseToMainFrame().catch(() => {
      this.message.set('Volte ao Checklist e tente conectar sua conta novamente.');
    });
  }
}

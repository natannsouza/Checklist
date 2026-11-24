import { TestBed } from '@angular/core/testing';
import { GraduationCap } from 'lucide-angular';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  const storageKey = 'checklist.test.habit';

  afterEach(() => localStorage.removeItem(storageKey));

  it('loads existing marks by day and keeps the reset scoped to the row', async () => {
    const saved = Array.from({ length: 7 }, (_, id) => ({ id, state: id === 6 ? 1 : 0 }));
    localStorage.setItem(storageKey, JSON.stringify(saved));
    await TestBed.configureTestingModule({ imports: [Checkbox] }).compileComponents();

    const fixture = TestBed.createComponent(Checkbox);
    fixture.componentRef.setInput('storageKey', storageKey);
    fixture.componentRef.setInput('habitName', 'Faculdade');
    fixture.componentRef.setInput('habitIcon', GraduationCap);
    await fixture.whenStable();

    const row = fixture.nativeElement as HTMLElement;
    const days = row.querySelectorAll<HTMLButtonElement>('.day-button');
    expect(days).toHaveLength(7);
    expect(days[0].getAttribute('aria-label')).toBe('Faculdade, Domingo, Concluído');
    expect(days[1].getAttribute('aria-label')).toBe('Faculdade, Segunda-feira, Sem marcação');
    expect(days[6].getAttribute('aria-label')).toBe('Faculdade, Sábado, Sem marcação');

    days[0].click();
    await fixture.whenStable();
    expect(days[0].getAttribute('aria-label')).toBe('Faculdade, Domingo, Não concluído');
    expect(JSON.parse(localStorage.getItem(storageKey)!)[6].state).toBe(2);

    row.querySelector<HTMLButtonElement>('[aria-label="Limpar marcações de Faculdade"]')!.click();
    await fixture.whenStable();
    expect(days[0].getAttribute('aria-label')).toBe('Faculdade, Domingo, Sem marcação');
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual(
      saved.map(({ id }) => ({ id, state: 0 })),
    );
  });
});

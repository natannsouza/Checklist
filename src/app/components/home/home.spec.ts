import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('aligns seven day columns with the four selected habits', () => {
    const page = fixture.nativeElement as HTMLElement;
    const initials = [...page.querySelectorAll('thead th [aria-hidden="true"]')].map((day) =>
      day.textContent?.trim(),
    );
    const rows = [...page.querySelectorAll('tbody tr')];

    expect(initials).toEqual(['S', 'T', 'Q', 'Q', 'S', 'S', 'D']);
    expect(rows.map((row) => row.querySelector('th')?.textContent?.trim())).toEqual([
      'Faculdade',
      'Musculação',
      'Estudos',
      'Inglês',
    ]);
    for (const row of rows) {
      expect(row.querySelectorAll('.day-button')).toHaveLength(7);
      expect(row.lastElementChild?.querySelector('.reset-button')).toBeTruthy();
    }
  });

  it.each([
    [new Date(2026, 10, 22), 'novembro de 2026', 'Semana de 22/11 a 28/11'],
    [new Date(2026, 10, 28), 'novembro de 2026', 'Semana de 22/11 a 28/11'],
    [new Date(2026, 11, 31), 'dezembro de 2026', 'Semana de 27/12 a 02/01'],
  ])('shows the month and Sunday-to-Saturday week for %s', async (date, month, week) => {
    component.data.set(date);
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('h1')?.textContent?.trim()).toBe(month);
    expect(page.querySelector('[data-week-range]')?.textContent?.trim()).toBe(week);
  });

  it('toggles the dashboard theme and restores it when reopened', async () => {
    const key = 'checklist.theme';
    const previous = localStorage.getItem(key);
    const page = fixture.nativeElement as HTMLElement;

    try {
      const toggle = page.querySelector<HTMLButtonElement>('header button[aria-pressed]')!;
      toggle.click();
      await fixture.whenStable();
      const theme = page.querySelector('main')?.getAttribute('data-theme');
      expect(theme).toBe(previous === 'dark' ? 'light' : 'dark');
      expect(localStorage.getItem(key)).toBe(theme);

      const reopened = TestBed.createComponent(Home);
      await reopened.whenStable();
      const reopenedPage = reopened.nativeElement as HTMLElement;
      expect(reopenedPage.querySelector('main')?.getAttribute('data-theme')).toBe(theme);
      reopened.destroy();
    } finally {
      if (previous === null) localStorage.removeItem(key);
      else localStorage.setItem(key, previous);
    }
  });
});

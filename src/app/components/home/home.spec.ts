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
    const initials = [...page.querySelectorAll('thead th [aria-hidden="true"]')].map(
      (day) => day.textContent?.trim(),
    );
    const rows = [...page.querySelectorAll('tbody tr')];

    expect(initials).toEqual(['S', 'T', 'Q', 'Q', 'S', 'S', 'D']);
    expect(rows.map((row) => row.querySelector('th')?.textContent?.trim())).toEqual([
      'Faculdade',
      'Musculação',
      'Código',
      'Inglês',
    ]);
    for (const row of rows) {
      expect(row.querySelectorAll('.day-button')).toHaveLength(7);
      expect(row.lastElementChild?.querySelector('.reset-button')).toBeTruthy();
    }
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signed } from './signed';

describe('Signed', () => {
  let component: Signed;
  let fixture: ComponentFixture<Signed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

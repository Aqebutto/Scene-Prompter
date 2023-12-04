import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextRewriteComponent } from './text-rewrite.component';

describe('TextRewriteComponent', () => {
  let component: TextRewriteComponent;
  let fixture: ComponentFixture<TextRewriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextRewriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextRewriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

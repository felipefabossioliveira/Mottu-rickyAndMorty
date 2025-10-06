import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAutocomplete } from './search-autocomplete';

describe('SearchAutocomplete', () => {
  let component: SearchAutocomplete;
  let fixture: ComponentFixture<SearchAutocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAutocomplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAutocomplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

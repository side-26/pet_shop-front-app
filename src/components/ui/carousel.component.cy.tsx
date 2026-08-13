import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

describe('Carousel RTL', () => {
  it('uses RTL direction, correct arrows, and advances with ArrowLeft', () => {
    cy.mount(
      <Carousel aria-label="Offers">
        <CarouselContent>
          {['One', 'Two', 'Three'].map((item) => (
            <CarouselItem key={item}>{item}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    cy.get('[data-slot="carousel"]').should('have.attr', 'dir', 'rtl').focus();
    cy.get('[data-slot="carousel-previous"] svg').should('have.class', 'lucide-chevron-right');
    cy.get('[data-slot="carousel-next"] svg').should('have.class', 'lucide-chevron-left');
    cy.get('[data-slot="carousel-next"]').should('not.be.disabled');
    cy.get('[data-slot="carousel"]').type('{leftarrow}');
    cy.get('[data-slot="carousel-previous"]').should('not.be.disabled');
  });
});

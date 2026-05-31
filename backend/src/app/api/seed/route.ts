export const dynamic = 'force-dynamic';
import { apiHandler } from '../../../infrastructure/utils/apiHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = apiHandler(async (request: Request) => {
  // Check if a user exists, otherwise create a test user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@vocabswipe.com',
        googleId: 'test-google-123',
      }
    });
  }

  // Check if a deck exists, otherwise create a test deck
  let deck = await prisma.deck.findFirst();
  if (!deck) {
    deck = await prisma.deck.create({
      data: {
        name: 'Temel İngilizce Kelimeler',
        description: 'En çok kullanılan 100 İngilizce kelime',
        authorId: user.id,
      }
    });
  }

  // Add some test flashcards if the deck is empty
  const cardCount = await prisma.card.count({ where: { deckId: deck.id } });
  if (cardCount === 0) {
    await prisma.card.createMany({
      data: [
        { deckId: deck.id, frontText: 'Apple', backText: 'Elma' },
        { deckId: deck.id, frontText: 'Book', backText: 'Kitap' },
        { deckId: deck.id, frontText: 'Cat', backText: 'Kedi' },
        { deckId: deck.id, frontText: 'Dog', backText: 'Köpek' },
        { deckId: deck.id, frontText: 'Elephant', backText: 'Fil' },
      ]
    });
  }

  return { 
    message: 'Test verisi başarıyla oluşturuldu!',
    user,
    deck,
    cardsCreated: cardCount === 0 ? 5 : 0
  };
});

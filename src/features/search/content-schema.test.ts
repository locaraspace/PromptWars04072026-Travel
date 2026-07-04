import { describe, it, expect } from 'vitest';
import { destinationContentSchema } from '@/features/search/content-schema';

const validContent = {
  name: 'Ayodhya',
  slug: 'ayodhya',
  country: 'India',
  region: 'Uttar Pradesh',
  city: null,
  summary: 'A spiritual town on the Sarayu.',
  description: 'Rich, immersive prose about Ayodhya.',
  bestSeason: 'October to March',
  attractions: [
    {
      title: 'Ram Mandir',
      description: 'A grand temple.',
      category: 'Temple',
      area: 'City centre',
      bestTime: 'Early morning',
      entryInfo: 'Free entry',
    },
  ],
  hiddenGems: [
    {
      title: 'Guptar Ghat',
      description: 'A quiet riverside spot.',
      whyLocalsLove: 'Peaceful mornings.',
      whyTouristsMiss: 'Off the main route.',
      bestVisitingTime: 'Sunrise',
      photographyTips: 'Golden hour light.',
      nearbyFood: 'Street chai stalls.',
    },
  ],
  heritageStory: {
    title: 'The city of Ram',
    story: 'An immersive narrative.',
    era: 'Ancient',
  },
  culturalExperiences: [
    {
      title: 'Sarayu Aarti',
      description: 'Evening river ritual.',
      duration: '1 hour',
      estimatedCost: 'Free',
      idealTime: 'Dusk',
      localTips: 'Arrive early.',
      familyFriendly: true,
      bookingRequired: false,
      authenticityRating: 5,
    },
  ],
  localFood: [
    {
      name: 'Kachori',
      description: 'Fried savoury snack.',
      whereToTry: 'Old market',
      type: 'Street food',
      priceRange: '₹20–50',
      mustTry: true,
    },
  ],
  travelTips: [{ category: 'Transport', tip: 'Use local rickshaws.' }],
};

describe('destinationContentSchema', () => {
  it('parses valid, complete content', () => {
    expect(destinationContentSchema.safeParse(validContent).success).toBe(true);
  });

  it('accepts null for optional fields (region/city/era)', () => {
    const result = destinationContentSchema.safeParse({
      ...validContent,
      region: null,
      city: null,
      bestSeason: null,
      heritageStory: { ...validContent.heritageStory, era: null },
    });
    expect(result.success).toBe(true);
  });

  it('rejects content missing a required section', () => {
    const { culturalExperiences: _omit, ...withoutCultural } = validContent;
    expect(destinationContentSchema.safeParse(withoutCultural).success).toBe(
      false,
    );
  });

  it('rejects an out-of-range authenticity rating', () => {
    const result = destinationContentSchema.safeParse({
      ...validContent,
      culturalExperiences: [
        { ...validContent.culturalExperiences[0], authenticityRating: 9 },
      ],
    });
    expect(result.success).toBe(false);
  });
});

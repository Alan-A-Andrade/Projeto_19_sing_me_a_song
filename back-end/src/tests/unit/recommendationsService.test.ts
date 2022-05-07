/* eslint-disable no-undef */

import { recommendationService } from '../../services/recommendationsService';
import { recommendationRepository } from '../../repositories/recommendationRepository';
import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';

const notFoundError = {
  message: '',
  type: 'not_found'
};

describe('unit - test /RecommendationService/upvote', () => {
  it('should throw erro if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'find').mockReturnValue(null);

    expect(async () => {
      await recommendationService.upvote(1);
    }).rejects.toEqual(notFoundError); ;
  });
});

describe('unit - test /RecommendationService/downvote', () => {
  it('should delete recommendation if a downvote bring to lower then -5', async () => {
    const recommendation = {
      id: 1,
      name: faker.name.findName(),
      youtubeLink: faker.internet.url(),
      score: -5
    };

    jest.spyOn(recommendationRepository, 'find').mockResolvedValue(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValue({ ...recommendation, score: -6 });

    const remove = jest
      .spyOn(recommendationRepository, 'remove')
      .mockResolvedValue(null);

    await recommendationService.downvote(1);

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('should throw erro if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'find').mockReturnValue(null);

    expect(async () => {
      await recommendationService.downvote(1);
    }).rejects.toEqual(notFoundError); ;
  });
});

describe('unit - test /RecommendationService/getByScore', () => {
  it('should findAll if filtered return no recommendations', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    const result = jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([]);

    await recommendationService.getByScore('gt');

    expect(result).toHaveBeenCalledTimes(2);
  });
});

describe('unit - test /RecommendationService/getByScore', () => {
  it('should findAll filtered with valid scoreFilter GT', async () => {
    const result = jest
      .spyOn(recommendationRepository, 'findAll');

    await recommendationService.getByScore('gt');

    expect(result).toBeCalledWith({ score: 10, scoreFilter: 'gt' });
  });
});

describe('unit - test /RecommendationService/getByScore', () => {
  it('should findAll filtered with valid scoreFilter lte', async () => {
    const result = jest
      .spyOn(recommendationRepository, 'findAll');

    await recommendationService.getByScore('lte');

    expect(result).toBeCalledWith({ score: 10, scoreFilter: 'lte' });
  });
});

describe('unit - test /RecommendationService/getScoreFilter', () => {
  it('should return lte if value is higher than 0.7', async () => {
    const result = recommendationService.getScoreFilter(0.71);

    expect(result).toBe('lte');
  });

  it('should return gt if value is lower than 0.7', async () => {
    const result = recommendationService.getScoreFilter(0.69);

    expect(result).toBe('gt');
  });
});

describe('unit - test /RecommendationService/Random', () => {
  it('should throw erro if no recommendation is found', async () => {
    jest.spyOn(recommendationService, 'getScoreFilter').mockReturnValue('gt');
    jest.spyOn(recommendationService, 'getByScore').mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(notFoundError);
  });
});

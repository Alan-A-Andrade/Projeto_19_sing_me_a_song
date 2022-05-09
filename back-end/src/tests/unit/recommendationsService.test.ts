/* eslint-disable no-undef */

import { recommendationService } from '../../services/recommendationsService';
import { recommendationRepository } from '../../repositories/recommendationRepository';
import { jest } from '@jest/globals';
import { recommendationDataFactory } from '../factories/recommendationFactory';

const notFoundError = {
  message: '',
  type: 'not_found'
};

const conflictError = {
  message: 'Recommendations names must be unique',
  type: 'conflict'
};

describe('unit - test /RecommendationService/Insert', () => {
  beforeEach(resetTests);
  it('should throw erro if duplicate recommendation is found', async () => {
    const recommendation = recommendationDataFactory();

    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue({ ...recommendation });
    jest.spyOn(recommendationRepository, 'create').mockResolvedValue();

    expect(async () => {
      await recommendationService.insert(recommendation);
    }).rejects.toEqual(conflictError); ;
  });
});

describe('unit - test /RecommendationService/upvote', () => {
  beforeEach(resetTests);
  it('should throw erro if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'find').mockReturnValue(null);

    expect(async () => {
      await recommendationService.upvote(1);
    }).rejects.toEqual(notFoundError); ;
  });
});

describe('unit - test /RecommendationService/downvote', () => {
  beforeEach(resetTests);
  it('should delete recommendation if a downvote bring to lower then -5', async () => {
    const recommendation = recommendationDataFactory();

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
  beforeEach(resetTests);
  it('should return recommendations', async () => {
    const recommendation = recommendationDataFactory();
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([recommendation]);

    const result = await recommendationService.getByScore('gt');

    expect(result).toEqual([recommendation]);
  });

  it('should findAll if filtered return no recommendations', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    const result = jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([]);

    await recommendationService.getByScore('gt');

    expect(result).toHaveBeenCalledTimes(2);
  });

  it('should findAll filtered with valid scoreFilter GT', async () => {
    const result = jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([]);

    await recommendationService.getByScore('gt');

    expect(result).toBeCalledWith({ score: 10, scoreFilter: 'gt' });
  });

  it('should findAll filtered with valid scoreFilter lte', async () => {
    const result = jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue([]);

    await recommendationService.getByScore('lte');

    expect(result).toBeCalledWith({ score: 10, scoreFilter: 'lte' });
  });

  it('should throw erro if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(notFoundError);
  });
});

describe('unit - test /RecommendationService/getScoreFilter', () => {
  beforeEach(resetTests);
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
  beforeEach(resetTests);
  it('should throw erro if no recommendation is found', async () => {
    jest.spyOn(recommendationService, 'getScoreFilter').mockReturnValue('gt');
    jest.spyOn(recommendationService, 'getByScore').mockResolvedValue([]);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(notFoundError);
  });
});

function resetTests() {
  jest.clearAllMocks();
  jest.resetAllMocks();
}

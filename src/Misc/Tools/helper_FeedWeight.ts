import { iArticle, iEvent } from 'src/Misc';

/**
 * @param date1 Date Object
 * @param date2 Date Object
 * @returns Number of days between the two dates, in days
 */
const dateDiffInDays = (date1: Date, date2: Date): number => {
  return Math.floor(
    (Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) /
      (1000 * 60 * 60 * 24),
  );
};

/**
 * @description Super Promoted static value
 */
const superPromoted = 9999;

/**
 * @description Promoted static value
 */
const promoted = 999;

/**
 * @description Days old static ranking(s)
 */
const dayRank: number[] = [7, 6, 5, 4, 3, 2, 1, 1, 1];

/**
 * @description Facility types static rankings
 */
const facilityRanking: any = {
  system: 5,
  division: 5,
  region: 8,
  facility: 8,
};

/**
 *
 * @param date Date object that days need to be added to
 * @param days The number of days to add to the date
 * @returns Date Object
 */
const addDays = (date: Date, days: number): Date => {
  const tempDate = new Date(date.getTime());
  return new Date(tempDate.setDate(tempDate.getDate() + days));
};

/**
 *
 * @param date Date object that days need to be subtracted from
 * @param days The number of days to subtract from the date
 * @returns Date Object
 */
const substractDays = (date: Date, days: number): Date => {
  const tempDate = new Date(date.getTime());
  return new Date(tempDate.setDate(tempDate.getDate() - days));
};

/**
 *
 * @param nLocations String value that is the location to be evalutated
 * @returns 'system' or 'region' or 'division' or 'facility' string to indicate the type of location
 */
const loc = (nLocations: string): string => {
  let nWeightLocation: string = '';

  if (nLocations !== null && nLocations.length > 0) {
    if (nLocations.indexOf('system') > 0) {
      nWeightLocation = 'system';
    } else if (nLocations.indexOf('region') > 0) {
      nWeightLocation = 'region';
    } else if (nLocations.indexOf('division') > 0) {
      nWeightLocation = 'division';
    } else {
      nWeightLocation = 'facility';
    }
  }

  return nWeightLocation;
};

export const evalArticleWeight = (article: iArticle) => {
  if (article.Promote || article.SuperPromoted) {
    const now = new Date(Date.now());
    const promoteStart = new Date(article.PromoteFromDate);
    const promoteEnd = new Date(article.PromoteEndDate);
    if (promoteStart < now && promoteEnd > now) {
      if (article.SuperPromoted) return superPromoted;
      if (article.Promote) return promoted;
    }
  }

  const location = loc(article.PublishToLocation);
  const parsed_publishDate = new Date(article.PublishDate);
  let weight = 1;
  const now: Date = new Date(Date.now());

  if (now > parsed_publishDate && dateDiffInDays(parsed_publishDate, now) < 7) {
    weight = dayRank[dateDiffInDays(parsed_publishDate, now)];
  } else {
    weight = dayRank[6];
  }

  const facilityRank: number = facilityRanking[location.toLowerCase()] ? facilityRanking[location] : 0;
  return weight + facilityRank;
};

export const evalEventWeight = (event: iEvent) => {
  if (event.Promote || event.SuperPromoted) {
    const now = new Date(Date.now());
    const promoteStart = new Date(event.PromoteFromDate);
    const promoteEnd = new Date(event.PromoteEndDate);
    if (promoteStart < now && promoteEnd > now) {
      if (event.SuperPromoted) return superPromoted;
      if (event.Promote) return promoted;
    }
  }

  const location = loc(event.PublishToLocation);
  let nWeight = 1;
  const now: Date = new Date(Date.now());
  const parsed_publishDate = new Date(event.PublishDate);
  const parsed_publishExpDate = new Date(event.ExpirationDate);
  const middate = new Date((parsed_publishDate.getTime() + parsed_publishExpDate.getTime()) / 2);
  const publishStartBreakDate = addDays(parsed_publishDate, 7);
  const publishEndBreakDate = substractDays(parsed_publishExpDate, 7);

  if (now > publishStartBreakDate && now < publishEndBreakDate) {
    nWeight = dayRank[6];
  }

  if (now >= parsed_publishDate && now <= middate && now <= publishStartBreakDate) {
    nWeight = dayRank[dateDiffInDays(parsed_publishDate, now)];
  }

  if (now >= middate && now <= parsed_publishExpDate && now >= publishEndBreakDate) {
    nWeight = dayRank[dateDiffInDays(now, parsed_publishExpDate)];
  }

  const facilityRank: number = facilityRanking[location.toLowerCase()] ? facilityRanking[location] : 0;

  return nWeight + facilityRank;
};

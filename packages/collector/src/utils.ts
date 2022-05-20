import moment, {Moment} from 'moment'
import {NowService} from './globals'

export function getNextSample(samples: number[]): number {
  const currentHour = moment().hour()
  if (currentHour >= samples[samples.length - 1]) return samples[0]
  const [x, ...xs] = samples
  return currentHour < x ? x : getNextSample(xs)
}

export function getNextSampleTime(nextSample: number, samples: number[]) {
  const expectedNext = moment()
  if (nextSample === samples[0]) expectedNext.add(1, 'days')
  expectedNext.set('hour', nextSample)
  expectedNext.set('minutes', 0)
  return expectedNext
}

export function getDuration(date: Moment) {
  const diff = moment.duration(date.diff(moment()))
  return diff
}

export function getDurationUntilNextSample(samples: number[]) {
  const nextSample = getNextSample(samples)
  const nextSampleTime = getNextSampleTime(nextSample, samples)
  return getDuration(nextSampleTime)
}
export const nowService: NowService = () => new Date()

import {makeLogger} from './logger'
export type Schedule = string // a schedule is a cron expression
export type NowService = () => Date
export type Logger = ReturnType<typeof makeLogger>

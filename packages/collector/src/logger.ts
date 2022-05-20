export function makeLogger() {
  let messages: Message[] = []
  type Message = {event: string; payload: object; level: number}
  type Metric = {name: string; value: number; unit: string}
  function record() {
    messages = []
  }

  function playback() {
    return messages.slice()
  }

  function info({event, payload}: {event: string; payload: object}) {
    log({event, payload, level: 20})
  }
  function warning({event, payload}: {event: string; payload: object}) {
    log({event, payload, level: 40})
  }
  function error({event, payload}: {event: string; payload: object}) {
    log({event, payload, level: 50})
  }

  function metrics(metrics: Metric[]) {
    // log using this format
    // "_aws": {
    //   "CloudWatchMetrics": [
    //     {
    //       "Metrics": [
    //         {
    //           "Name": "Time",
    //           "Unit": "Milliseconds"
    //         }
    //       ],
    //       ...
    //     }
    //   ]
    // },
  }

  function log(message: Message) {
    messages.push(message)
    console.log(JSON.stringify(message))
  }

  return {
    info,
    warning,
    error,
    record,
    playback,
  }
}

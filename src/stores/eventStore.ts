import { defineStore } from "pinia"
import type { eventWithTime } from '@rrweb/types'

interface EventState {
  events: eventWithTime[]
}

export const useEventStore = defineStore('eventStore',{
  state: () : EventState => ({
    events: []
  }),
  getters: {
    
  },
  actions: {
    setEvents(events) {
      this.events.push(events)
    },
    getEvent() {
      return this.events
    }
  }
})
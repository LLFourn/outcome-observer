<template>
    <v-col cols="12">
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @change="updateRange"
          @click:date="(data) => $emit('click:date', data.date)"
          @mouseenter:event="(data) => $emit('mouseenter:event', data.day.date + '/' + data.event.name)"
          @mouseleave:event="() => $emit('mouseleave:event')"
          @click:more="(data) => $router.push(hrefFor(data.date))"
          @click:event="(data) => $router.push(hrefFor(data.day.date + '/' + data.event.name))"

          >
          <template v-slot:day-label="data">
              <v-btn
                @mouseover="{ if(!dateDisabled(data.date)) { $emit('mouseenter:date', data.date) } }"
                @mouseleave="$emit('mouseleave:date')"
                color fab depressed small :to="hrefFor(data.date)" :disabled="dateDisabled(data.date)">{{ data.day }}</v-btn>
          </template>
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
</template>


<script type="text/javascript">
export default {
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
  }),
  props: ["dates", "hrefFor"],
  mounted () {
    this.$refs.calendar.checkChange()
  },
  methods: {
    dateDisabled(date) {
      return !this.dates.hasOwnProperty(date)
    },

    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    updateRange ({ start, end }) {
      const events = []
      for (let [ date, on_date ] of Object.entries(this.dates) ) {
        on_date.forEach(event => {
          events.push({
            name: event,
            start: new Date(`${date}T00:00:00`),
            end: new Date(`${date}T12:00:00`),
            color: "blue",
            timed: false
          })
        });
      }

        this.events = events
      },
    },
  }
</script>

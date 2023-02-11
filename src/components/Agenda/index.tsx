import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  subWeeks,
} from 'date-fns';
import { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { formatDate } from '../../utils/date';

interface IAgendaProps<DataItem extends any> {
  pastWeeks?: number;
  futureWeeks?: number;
  data: Record<string, DataItem[]>;
  keyExtractor: (item: DataItem) => any;
  renderItem(item: DataItem): JSX.Element;
}

function Agenda<DataItem>({
  pastWeeks = 1,
  futureWeeks = 1,
  ...props
}: IAgendaProps<DataItem>) {
  const [calendarWidth, setCalendarWidth] = useState<number>(0);
  const [agendaListwidth, setAgendaListWidth] = useState<number>(0);

  const calendarRef = useRef<ScrollView>(null);
  const agendaRef = useRef<ScrollView>(null);
  const scrollControl = useRef({
    isCalendarScrolling: false,
    isAgendaScrolling: false,
  });

  const allWeeks = useMemo(() => {
    const today = new Date();
    const firstWeek = subWeeks(today, pastWeeks);
    const lastWeek = addWeeks(today, futureWeeks);

    const weeks = eachWeekOfInterval({ start: firstWeek, end: lastWeek }).map(
      (start) =>
        eachDayOfInterval({ start, end: addDays(start, 6) }).map(formatDate)
    );

    return weeks;
  }, [pastWeeks, futureWeeks]);

  const highlightedDays = useMemo(() => Object.keys(props.data), [props.data]);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendar}>
        <View style={styles.calendarScrollContainer}>
          <ScrollView
            style={styles.calendarScrollable}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={() => {
              scrollControl.current.isCalendarScrolling = true;
              scrollControl.current.isAgendaScrolling = false;
            }}
            onScroll={(e) => {
              if (scrollControl.current.isAgendaScrolling) return;
              const offsetX = e.nativeEvent.contentOffset.x;
              const relativeOffset = offsetX / calendarWidth;
              const agendaOffsetX = agendaListwidth * relativeOffset;
              agendaRef.current?.scrollTo({
                x: agendaOffsetX,
                animated: false,
              });
            }}
            onLayout={(e) => {
              setCalendarWidth(e.nativeEvent.layout.width);
            }}
            ref={calendarRef}
          >
            {allWeeks.map((week, weekIdx) => (
              <View
                key={weekIdx}
                style={[styles.weekWrapper, { width: calendarWidth }]}
              >
                {week.map((day) => {
                  const isHighlighted = highlightedDays.includes(day.str);
                  const color = isHighlighted ? 'black' : '#909090';
                  const fontWeight = isHighlighted ? '700' : '400';
                  return (
                    <View key={day.str} style={styles.dayContainer}>
                      <Text style={{ color, fontWeight }}>{day.short}</Text>
                      <Text style={{ color, fontWeight }}>{day.number}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      {/* Agenda List */}
      <View style={agendaStyles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => {
            scrollControl.current.isAgendaScrolling = true;
            scrollControl.current.isCalendarScrolling = false;
          }}
          onScroll={(e) => {
            if (scrollControl.current.isCalendarScrolling) return;
            const absoluteOffset = e.nativeEvent.contentOffset.x;
            const relativeOffset = absoluteOffset / agendaListwidth;
            const calendarOffsetX = calendarWidth * relativeOffset;
            calendarRef.current?.scrollTo({
              x: calendarOffsetX,
              animated: false,
            });
          }}
          onLayout={(e) => {
            setAgendaListWidth(e.nativeEvent.layout.width);
          }}
          ref={agendaRef}
        >
          {allWeeks.map((week, weekIdx) => (
            <View
              key={weekIdx}
              style={[agendaStyles.weekWrapper, { width: agendaListwidth }]}
            >
              <ScrollView
                style={agendaStyles.weekScrollable}
                showsVerticalScrollIndicator={false}
              >
                {week.map((day) => (
                  <View key={day.str} style={agendaStyles.dayWrapper}>
                    <View style={agendaStyles.dayIdentifier}>
                      <Text style={agendaStyles.dayShort}>{day.short}</Text>
                      <Text style={agendaStyles.dayNumber}>{day.number}</Text>
                    </View>
                    <View style={agendaStyles.dayContentWrapper}>
                      <View style={agendaStyles.dayContent}>
                        {!!props.data[day.str] &&
                          props.data[day.str].map((item) => {
                            const ScheduleItem = () => props.renderItem(item);
                            return (
                              <ScheduleItem key={props.keyExtractor(item)} />
                            );
                          })}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const agendaStyles = StyleSheet.create({
  container: { flex: 1 },
  weekScrollable: {
    flex: 1,
  },
  weekWrapper: {
    backgroundColor: 'white',
    flex: 1,
  },
  dayWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  dayContentWrapper: {
    flex: 6,
    backgroundColor: '#f7f7ff',
    borderRadius: 8,
    padding: 8,
    paddingLeft: 0,
  },
  dayContent: {
    flex: 1,
    justifyContent: 'center',
    // borderLeftColor: '#c0c0c0',
    // borderLeftWidth: 1,
    paddingLeft: 8,
  },
  dayIdentifier: {
    paddingTop: 8,
    paddingLeft: 8,
    alignItems: 'center',
    flex: 1,
  },
  dayShort: {
    // fontWeight: '500',
  },
  dayNumber: {
    fontSize: 24,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  calendar: {
    backgroundColor: 'white',
    padding: 8,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  calendarScrollContainer: {},
  calendarScrollable: {
    flexDirection: 'row',
  },
  weekWrapper: {
    flexDirection: 'row',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Agenda;

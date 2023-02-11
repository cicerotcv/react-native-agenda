import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Agenda from './src/components/Agenda';
import { todoCollection } from './src/utils';

import _ from 'lodash';
import { format } from 'date-fns';

const data = _.groupBy(todoCollection, (todo) =>
  format(todo.date, 'yyyy-MM-dd')
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#cc0000" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Agenda
          pastWeeks={2}
          futureWeeks={2}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <ScheduleItem data={item} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const ScheduleItem: React.FC<{ data: (typeof todoCollection)[number] }> = (
  props
) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.header}>
        <Text style={itemStyles.title}>{props.data.title}</Text>
      </View>
      <Text style={itemStyles.description}>{props.data.description}</Text>
    </View>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    elevation: 4,
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  header: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: { color: 'black', fontSize: 16, fontWeight: '500' },
  description: { color: '#505050', fontSize: 14 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

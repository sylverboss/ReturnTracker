import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Chrome as Home, ChartBar as BarChart2, Mail, User, Plus } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const tabBarStyle = {
    height: 60 + insets.bottom,
    paddingBottom: insets.bottom,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#ffffff',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute' as const,
    elevation: 0,
  };

  const blurViewStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderTopWidth: 0.5,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: tabBarStyle,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: -5,
        },
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <AnimatedBlurView 
              intensity={80} 
              tint="light" 
              style={blurViewStyle} 
            />
          ) : null,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="returns"
        options={{
          title: 'Returns',
          tabBarIcon: ({ color, size }) => (
            <Mail size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <View style={styles.addButton}>
              <Plus size={24} color="#FFFFFF" />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('add-return');
          },
        })}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
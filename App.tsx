import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationProvider } from './context/NavigationContext';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/(auth)/login';
import SignupScreen from './app/(auth)/signup';
import ProfileCompletion from './app/profile-completion';
import EmailConfirmedScreen from './app/email-confirmed';
import { AuthStateListener } from './components/AuthStateListener';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationProvider>
            <NavigationContainer>
                <AuthStateListener />
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ProfileCompletion" component={ProfileCompletion} />
                    <Stack.Screen 
                        name="EmailConfirmed" 
                        component={EmailConfirmedScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </NavigationProvider>
    );
} 
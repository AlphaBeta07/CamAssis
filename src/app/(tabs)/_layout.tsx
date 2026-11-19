import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, Heart, Image as ImageIcon, User } from 'lucide-react-native';
import { colors, fonts } from '../../theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.inkPrimary,
        tabBarInactiveTintColor: '#7A6B60',
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopWidth: 2,
          borderTopColor: colors.borderPrimary,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: fonts.monoBold,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={21} color={color} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Compass size={21} color={color} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <Heart size={21} color={color} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: 'Photos',
          tabBarIcon: ({ color, focused }) => (
            <ImageIcon size={21} color={color} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User size={21} color={color} strokeWidth={focused ? 2.8 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

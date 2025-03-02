# Font and Icon Loading in ReturnTracker

## Font Loading Strategy

ReturnTracker uses a robust font loading strategy to ensure a smooth user experience while maintaining performance.

### Font Loading Process

1. **Font Declaration**: The app uses the Inter font family with four weights:
   - Inter-Regular
   - Inter-Medium
   - Inter-SemiBold
   - Inter-Bold

2. **Loading Mechanism**: Fonts are loaded using Expo's `useFonts` hook, which returns both a loading state and an error state:
   ```typescript
   const [fontsLoaded, fontError] = useFonts({
     'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
     'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
     'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
     'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
   });
   ```

3. **Error Handling**: The app now properly handles font loading errors, allowing the app to continue with system fonts as fallbacks if custom fonts fail to load.

4. **Splash Screen Integration**: The native splash screen is kept visible until fonts are loaded (or fail to load), then a custom animated splash screen is shown before transitioning to the main app.

### Font Usage Guidelines

- Use the font family names consistently throughout the app:
  ```typescript
  // Example style
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
    }
  });
  ```

- Font weights should be used as follows:
  - Regular (400): General body text
  - Medium (500): Secondary headings, emphasized text
  - SemiBold (600): Primary headings, buttons
  - Bold (700): App title, very important text

## Icon Loading Strategy

ReturnTracker uses an optimized approach for loading and using icons from the Lucide React Native library.

### Icon Provider System

1. **Centralized Icon Loading**: All icons are loaded once through the `IconProvider` component, which wraps the entire app:
   ```typescript
   <IconProvider>
     <App />
   </IconProvider>
   ```

2. **Icon Context**: Icons are stored in a React Context, making them available throughout the app without repeated imports:
   ```typescript
   const IconContext = createContext<Record<string, any>>({});
   ```

3. **Icon Usage**: Icons can be used via the `Icon` component or the `useIcon` hook:
   ```typescript
   // Using the Icon component
   <Icon name="Home" size={24} color="#3B82F6" />
   
   // Using the useIcon hook
   const HomeIcon = useIcon('Home');
   return <HomeIcon size={24} color="#3B82F6" />;
   ```

### Benefits of This Approach

1. **Performance**: Icons are loaded once at app startup, reducing the overhead of importing icons in multiple components.
2. **Bundle Size**: Only the icons that are actually used are included in the bundle.
3. **Consistency**: Icon usage is standardized across the app.
4. **Type Safety**: The icon component provides proper TypeScript typing.

## Asset Preloading

The app preloads essential assets during startup to ensure a smooth user experience:

1. **Image Preloading**: Key images are preloaded using Expo's Asset system:
   ```typescript
   const preloadAssets = async () => {
     const imageAssets = [
       require('../assets/images/icon.png'),
       require('../assets/images/favicon.png'),
     ];
     
     const loadImages = imageAssets.map(image => {
       if (typeof image === 'string') {
         return Image.prefetch(image);
       } else {
         return Asset.fromModule(image).downloadAsync();
       }
     });
     
     await Promise.all(loadImages);
   };
   ```

2. **Parallel Loading**: Assets are loaded in parallel with fonts to optimize startup time.

## Custom Splash Screen

The app uses a custom splash screen with smooth animations to enhance the user experience during startup:

1. **Animation Sequence**:
   - Logo appears with scale and rotation animations
   - App name fades in with a slight upward movement
   - Tagline fades in last
   - Short pause before transitioning to the main app

2. **Callback Integration**: The splash screen notifies the app when animations are complete:
   ```typescript
   <CustomSplashScreen onAnimationComplete={onSplashAnimationComplete} />
   ```

## Best Practices

1. **Font Fallbacks**: Always provide system font fallbacks in case custom fonts fail to load.
2. **Preload Critical Assets**: Identify and preload only the most critical assets needed for initial rendering.
3. **Error Handling**: Implement proper error handling for all asset loading operations.
4. **Loading Indicators**: Show appropriate loading indicators or splash screens during resource loading.
5. **Performance Monitoring**: Regularly monitor and optimize asset loading performance.
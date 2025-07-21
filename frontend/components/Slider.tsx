import { StyleSheet, View, FlatList, Dimensions, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import React, { useRef, useState } from 'react';
import LaunchScreen from '../screens/onboarding/LaunchScreen';
import Onboarding_1 from '../screens/onboarding/Onboarding_1';
import Onboarding_2 from '../screens/onboarding/Onboarding_2';
import Onboarding_3 from '../screens/onboarding/Onboarding_3';

const { width } = Dimensions.get('window');

const slides = [
    { id: '0', render: () => <LaunchScreen /> },
    { id: '1', render: (goToNextSlide: () => void) => <Onboarding_1 goToNextSlide={goToNextSlide} /> },
    { id: '2', render: (goToNextSlide: () => void) => <Onboarding_2 goToNextSlide={goToNextSlide} /> },
    { id: '3', render: () => <Onboarding_3 /> },
];

const Slider = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / width);
                setCurrentIndex(index);
            },
        }
    );

    const goToNextSlide = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < slides.length) {
            flatListRef.current?.scrollToIndex({ index: nextIndex });
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={[{ width, flex: 1 }]}>
            {item.render(goToNextSlide)}
        </View>
    );

    const Pagination = () => (
        <View style={styles.pagination}>
            {slides.slice(1).map((_, i) => (
                <View key={i} style={[ styles.dot, currentIndex === i + 1 ? styles.dotActive : styles.dotInactive, ]}/>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />
            {currentIndex !== 0 && <Pagination />}
        </View>
    );
};

export default Slider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        top: 76,
        alignSelf: 'center',
        height: 5,
        gap: 4,
    },
    dot: {
        height: 5,
        borderRadius: 2.5,
        marginHorizontal: 2,
    },
    dotActive: {
        width: 24,
        backgroundColor: 'white',
    },
    dotInactive: {
        width: 24,
        backgroundColor: '#333333',
    },
});

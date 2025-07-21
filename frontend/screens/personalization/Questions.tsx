import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, Image, } from 'react-native'
import React, { useEffect, useState } from 'react';
import EdgeBetIcon from '../../assets/edgebet_icon_white.png';
import fanduel from '../../assets/fanduel.png';
import betmgm from '../../assets/betmgm.png';
import betrivers from '../../assets/betrivers.png';
import draftkings from '../../assets/draftkings.png';
import pointsbet from '../../assets/pointsbet.png';
import espnbet from '../../assets/espnbet.png';
import { useFonts } from 'expo-font';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../components/Router';


const Questions = () => {
    const [selectedBetValue, setSelectedBetValue] = useState<string[]>([]);
    const [selectedSportsbookValue, setSelectedSportsbookValue] = useState<string[]>([]);
    const betOptions = [ 'Player Props', 'Head to Head/Moneyline', 'Spreads', 'Alternate Spreads', ];
    const lineChangesOptions = [ '5-10% Line Changes', '10-20% Line Changes', '30%+ Line Changes', '40%+ Line Changes' ]
    const [step, setStep] = useState<'betTypes' | 'sportsbooks' | 'lineChanges'| 'personalizing'>('betTypes');
    const [progress, setProgress] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Questions'>>();
    const { phoneNumber, firstName } = route.params;

    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
        'RobotoBold': require('../../assets/fonts/Roboto-Bold.ttf'),
        'WorkSansRegular': require('../../assets/fonts/WorkSans-Regular.ttf'),
        'WorkSansSemiBold': require('../../assets/fonts/WorkSans-SemiBold.ttf'),
    });

    const TOTAL_SEGMENTS = 10;
    const RADIUS = 50;
    const STROKE_WIDTH = 14;
    const GAP_ANGLE = 2;
    const FULL_CIRCLE = 360;
    const PURPLE = '#8001FF';

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
          x: centerX + radius * Math.cos(angleInRadians),
          y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    const LoadingSpinner = ({ progress }: { progress: number }) => {
        const filledSegments = Math.round(TOTAL_SEGMENTS * progress);
      
        const createSegment = (index: number) => {
            const anglePerSegment = FULL_CIRCLE / TOTAL_SEGMENTS;
            const startAngle = index * anglePerSegment;
            const endAngle = startAngle + anglePerSegment - GAP_ANGLE;
      
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const start = polarToCartesian(RADIUS + STROKE_WIDTH / 2, RADIUS + STROKE_WIDTH / 2, RADIUS, endAngle);
            const end = polarToCartesian(RADIUS + STROKE_WIDTH / 2, RADIUS + STROKE_WIDTH / 2, RADIUS, startAngle);

      
            const d = [
                `M ${start.x} ${start.y}`,
                `A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y}`
            ].join(' ');
      
            return (
                <Path key={index} d={d} stroke={index < filledSegments ? PURPLE : '#fff'} strokeWidth={STROKE_WIDTH} fill="none"/>
            );
        };
      
        return (
            <View style={styles.spinnerWrapper}>
                <Svg width={2 * RADIUS + STROKE_WIDTH} height={2 * RADIUS + STROKE_WIDTH}>
                    <G rotation="0" originX={RADIUS + STROKE_WIDTH / 2} originY={RADIUS + STROKE_WIDTH / 2}>
                        {[...Array(TOTAL_SEGMENTS)].map((_, i) => createSegment(i))}
                    </G>
                </Svg>
                <Text style={styles.spinnerText}>{Math.min(Math.round(progress * 100), 100)}%</Text>
            </View>
        );
    };

    const handleSavePreferences = async (update: Partial<{
        betTypes: string[];
        sportsbooks: string[];
        lineChanges: string[];
      }>) => {
        try {
          await fetch('http://localhost:4000/api/users/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, ...update }),
          });
        } catch (err) {
          console.error('Failed to save preferences:', err);
        }
    };

    useEffect(() => {
        if (step === 'personalizing' && !hasStarted) {
            setHasStarted(true);
            let current = 0;

            const interval = setInterval(() => {
                current += 0.1;
                const capped = Math.min(current, 1);
                setProgress(capped);
                if (current >= 1) {
                    clearInterval(interval);
                }
            }, 600);
        return () => clearInterval(interval);
        }
    }, [step]);

    useEffect(() => {
        if (progress >= 1) {
            navigation.navigate('TrialPage', { phoneNumber, firstName });
        }
    }, [progress]);

    const toggleOption = (option: string) => {
        setSelectedBetValue((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const toggleSportsbook = (bookName: string) => {
        setSelectedSportsbookValue((prev) =>
            prev.includes(bookName) ? prev.filter((item) => item !== bookName) : [...prev, bookName]
        );
    };
      

    if (!fontsLoaded) return null;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <StatusBar hidden={true} />
                <Image source={EdgeBetIcon} style={styles.logo} />
                {step === 'betTypes' ? (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>What types of bets do you want to be notified about?</Text>
                        <Text style={styles.text}>You can choose more than 1</Text>

                        {betOptions.map((option) => { 
                            const isSelected = selectedBetValue.includes(option);
                            return (
                                <TouchableOpacity key={option} onPress={() => toggleOption(option)} style={[styles.optionButton, selectedBetValue.includes(option) && styles.optionButtonSelected]}>
                                    <View style={[styles.radioCircle, selectedBetValue.includes(option) && styles.radioCircleSelected]}>
                                        {selectedBetValue.includes(option) && <View style={styles.radioInnerDot} />}
                                    </View>
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            );
                        })}
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.button} onPress={() => { handleSavePreferences({ betTypes: selectedBetValue }); setStep('sportsbooks'); }}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : step === 'sportsbooks' ? (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>What Sportsbooks do you typically use</Text>
                        <Text style={styles.text}>You can choose more than 1</Text>
                        
                        <View style={styles.sportsbooks}>
                            {[
                                { name: 'fanduel', img: fanduel },
                                { name: 'betmgm', img: betmgm },
                                { name: 'betrivers', img: betrivers },
                                { name: 'draftkings', img: draftkings },
                                { name: 'pointsbet', img: pointsbet },
                                { name: 'espnbet', img: espnbet },
                            ].map(({ name, img }, idx) => (
                                <TouchableOpacity key={idx} onPress={() => toggleSportsbook(name)} style={[ styles.bookWrapper, selectedSportsbookValue.includes(name) && styles.bookWrapperSelected]}>
                                    <Image source={img} style={styles.bookOption} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.button} onPress={() => { handleSavePreferences({ sportsbooks: selectedSportsbookValue }); setStep('lineChanges'); }}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : step === 'lineChanges' ? (
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>What types of bets do you want to be notified about?</Text>
                        <Text style={styles.text}>You can choose more than 1</Text>

                        {lineChangesOptions.map((option) => { 
                            const isSelected = selectedBetValue.includes(option);
                            return (
                                <TouchableOpacity key={option} onPress={() => toggleOption(option)} style={[styles.optionButton, selectedBetValue.includes(option) && styles.optionButtonSelected]}>
                                    <View style={[styles.radioCircle, selectedBetValue.includes(option) && styles.radioCircleSelected]}>
                                        {selectedBetValue.includes(option) && <View style={styles.radioInnerDot} />}
                                    </View>
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            );
                        })}
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.button} onPress={() => { const selectedLineChanges = selectedBetValue.filter(option => lineChangesOptions.includes(option)); handleSavePreferences({ lineChanges: selectedLineChanges }); setStep('personalizing'); }}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : step === 'personalizing' ? (
                    <View style={styles.personalizingContentContainer}>
                        <LoadingSpinner progress={progress} />
                        <Text style={styles.personalizingTitle}>Personalizing Your EdgeBet Experience</Text>
                        <Text style={styles.subtitle}>Verifying your account details</Text>
                    </View>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Questions

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    contentContainer: {
        top: 60,
    },
    title: {
        fontFamily: 'RobotoBold',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    text: {
        fontFamily: 'SFProDisplayRegular',
        color: 'white',
        fontSize: 15,
        marginBottom: 45,
    },
    logo: {
        width: 53,
        height: 44,
        position: 'absolute',
        resizeMode: 'contain',
        top: 59,
        left: 23,
    },
    button: {
        backgroundColor: '#8001FF',
        paddingVertical: 16,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 'auto',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonWrapper: {
        top: 195,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        backgroundColor: '#1a1a1a',
    },
    optionButtonSelected: {
        backgroundColor: 'rgba(128, 1, 255, 0.2)',
        borderColor: '#8001FF',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#59606D',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleSelected: {
        backgroundColor: '#8001FF',
        borderColor: '#8001FF',
    },
    radioInnerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    sportsbooks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 20,
        columnGap: 12,
        paddingHorizontal: 0, 
        marginBottom: 47,
    },
    bookOption: {
        width: 88,
        height: 88,
        resizeMode: 'contain',
        backgroundColor: 'black',
    },
    bookWrapper: {
        width: 96,
        height: 100,
        aspectRatio: 1,
        margin: '1.5%',
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 1,
    },
    bookWrapperSelected: {
        backgroundColor: 'rgba(128, 1, 255, 0.2)', 
        borderColor: '#8001FF',
    },
    subtitle: {
        fontFamily: 'WorkSansRegular',
        color: 'rgba(255, 255, 255, 0.67)',
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
    },
    personalizingTitle: {
        fontFamily: 'WorkSansSemiBold',
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 38,
        marginTop: 24,
    },
    personalizingContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 80,
    },
    spinnerWrapper: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 20,
        marginBottom: 25,
    },
    spinnerText: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
        fontFamily: 'RobotoBold',
        textAlign: 'center',
    },
});
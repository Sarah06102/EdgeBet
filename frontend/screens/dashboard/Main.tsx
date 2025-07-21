import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar';
import { BlurView } from 'expo-blur';
import Fontisto from '@expo/vector-icons/Fontisto';
import SettingsModal from '../../components/SettingsModal';
import { useFonts } from 'expo-font';
import LogoutConfirmModal from '../../components/LogoutConfirmModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/Router';

type Match = {
    id: string;
    teams: [string, string];
    sport_key: string;
    commence_time: string;
    home_team?: string;
    away_team?: string;
    bookmakers: {
      key: string;
      markets: {
        key: string;
        outcomes: {
          name: string;
          price: number;
        }[];
      }[];
    }[];
};

const sportsbooks = [
    { name: 'FANDUEL', icon: require('../../assets/fanduel.png') },
    { name: 'ESPN BET', icon: require('../../assets/espnbet.png') },
    { name: 'DRAFT KINGS', icon: require('../../assets/draftkings.png') },
    { name: 'POINTSBET', icon: require('../../assets/pointsbet.png') },
    { name: 'BETRIVERS', icon: require('../../assets/betrivers.png') },
    { name: 'BETMGM', icon: require('../../assets/betmgm.png') },
];

const sportKeyMap: Record<string, string> = {
    'FANDUEL': 'americanfootball_nfl',
    'DRAFT KINGS': 'basketball_nba',
    'ESPN BET': 'basketball_ncaab',
    'POINTSBET': 'icehockey_nhl',
    'BETRIVERS': 'baseball_mlb',
    'BETMGM': 'soccer_epl',
};

const allSportKeys = [
    'baseball_mlb',
    'basketball_nba',
    'basketball_ncaab',
    'icehockey_nhl',
    'soccer_epl',
    'americanfootball_nfl',
];

const sportLabelToKey: Record<string, string> = {
    'Baseball ⚾️': 'baseball_mlb',
    'Basketball 🏀': 'basketball_nba',
    'Hockey 🏒': 'icehockey_nhl',
    'Soccer ⚽️': 'soccer_epl',
    'Specials 🎁': 'americanfootball_nfl',
};

const Main = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selected, setSelected] = useState(sportsbooks[0]);
    const [countryFlag, setCountryFlag] = useState('🇨🇦');
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSport, setSelectedSport] = useState('Baseball ⚾️');
    const [user, setUser] = useState(null);
    const route = useRoute<any>();
    const phoneNumber = route.params?.phoneNumber;
    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;
    const navigation = useNavigation<NavigationProp>();

    const [fontsLoaded] = useFonts({
        'SFProDisplayRegular': require('../../assets/fonts/SFProDisplayRegular.otf'),
        'SFProDisplayBold': require('../../assets/fonts/SFProDisplayBold.otf'),
        'RobotoBold': require('../../assets/fonts/Roboto-Bold.ttf'),
        'WorkSansRegular': require('../../assets/fonts/WorkSans-Regular.ttf'),
        'WorkSansSemiBold': require('../../assets/fonts/WorkSans-SemiBold.ttf'),
        'RobotoRegular': require('../../assets/fonts/Roboto-Regular.ttf'),
        'RobotoSemiBold': require('../../assets/fonts/Roboto-SemiBold.ttf'),
        'RobotoLight': require('../../assets/fonts/Roboto-Light.ttf'),
        'InterRegular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
        'BunkenTech': require('../../assets/fonts/BunkenTechSansPro-ExBdIt.ttf'),
        'DMSansBold': require('../../assets/fonts/DMSans_24pt-Bold.ttf'),
        'DMSansLight': require('../../assets/fonts/DMSans_18pt-Light.ttf'),
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!phoneNumber) {
                console.warn('Phone number not provided.');
                return;
            }
      
            try {
                const checkUser = await axios.post('http://localhost:4000/api/users/signin', {
                    phoneNumber,
                });
      
                if (checkUser.data.userExists) {
                    const profileRes = await axios.get(`http://localhost:4000/api/users/profile?phoneNumber=${encodeURIComponent(phoneNumber)}`);
                    console.log('Fetched user profile:', profileRes.data.user);
                    setUser(profileRes.data.user);
                } else {
                    console.log('User does not exist. Skipping profile fetch.');
                }
            } catch (err) {
                console.error('Error checking user or fetching profile:', err);
            }
        };
        fetchUserProfile();
    }, [phoneNumber]);      
      
    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const allMatches: Match[] = [];
      
            console.log('Starting to fetch matches for each sport...');
          
            for (const sport of allSportKeys) {
                try {
                    console.log(`Fetching matches for sport: ${sport}`);
                    const res = await fetch(`http://localhost:4000/api/odds/matches?sport=${sport}`);
                    const data = await res.json();
      
                    if (Array.isArray(data)) {
                        console.log(`✅ Received ${data.length} matches for sport: ${sport}`);
                        allMatches.push(...data);
                    } else {
                        console.warn(`Unexpected data format for sport: ${sport}`, data);
                    }
                } catch (err) {
                    console.error(`Error fetching matches for ${sport}:`, err);
                }
            }
      
            console.log(`Total matches fetched: ${allMatches.length}`);
            setMatches(allMatches);
            setLoading(false);
      
            if (allMatches.length === 0) {
                console.warn('No matches returned at all.');
                return;
            }
      
            // Map sportsbooks to their available sports
            const sportsbookToSports: Record<string, Set<string>> = {};
            allMatches.forEach((match) => {
                if (!match.bookmakers || match.bookmakers.length === 0) {
                    console.warn(`No bookmakers for match ID ${match.id}`);
                    return;
                }
      
                match.bookmakers.forEach((bm) => {
                    const sportsbook = bm.key.toLowerCase().replace(/\s+/g, '');
                    if (!sportsbookToSports[sportsbook]) {
                        sportsbookToSports[sportsbook] = new Set();
                    }
                    sportsbookToSports[sportsbook].add(match.sport_key);
                });
            });
    
            console.log('Full sportsbook-to-sports mapping:');
                Object.entries(sportsbookToSports).forEach(([book, sports]) => {
                console.log(`${book}: ${[...sports].join(', ')}`);
            });
      
          // Find sportsbooks with identical sports
            const sportGroups = Object.entries(sportsbookToSports).reduce((acc, [book, sports]) => {
                const key = [...sports].sort().join('|');
                if (!acc[key]) acc[key] = [];
                acc[key].push(book);
                return acc;
            }, {} as Record<string, string[]>);
      
            Object.values(sportGroups).forEach((group) => {
                if (group.length > 1) {
                console.log(`These sportsbooks have identical sports: ${group.join(', ')}`);
                }
            });
      
            console.log('Match fetching + mapping complete.');
        };
        fetchMatches();
    }, [selected]);
      
    const filteredMatches = matches.filter((match) => {
        const matchesSport = match.sport_key === sportLabelToKey[selectedSport];
        const matchesBook = match.bookmakers?.some((bm: any) =>
            bm.key.toLowerCase().includes(selected.name.toLowerCase().replace(/\s+/g, ''))
        );
        return matchesSport && matchesBook;
    });
      
    console.log('Selected Sport:', selectedSport);
    console.log('Mapped Sport Key:', sportLabelToKey[selectedSport]);


    const handleLogout = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
      
            if (!token) {
                console.warn('No token found in AsyncStorage');
                throw new Error('No token available for logout');
            }

            const response = await axios.post('http://192.168.1.71:4000/api/users/logout', {}, {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
            });
      
          console.log('Logout success:', response.data);
          await AsyncStorage.removeItem('token');
      
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding', params: undefined } as const],
          });
      
        } catch (err: any) {
          console.error('Logout failed:', err.response?.data || err.message || err);
        }
    };
      
    const handleDeleteAccount = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.warn('Missing token');
            return;
          }
      
          const response = await axios.delete('http://192.168.1.71:4000/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          console.log('Account deleted:', response.data);
          await AsyncStorage.removeItem('token');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        } catch (err: any) {
          console.error('Error deleting account:', err.response?.data || err.message || err);
        }
    };
      

    if (!fontsLoaded) return null;

    return (
        <>
            {dropdownVisible && (
                <View style={styles.dropdownWrapper}>
                    <BlurView intensity={10} tint="dark" style={styles.partialBlur} />
                    <View style={styles.dropdown}>
                        {sportsbooks.map((s, i) => (
                            <TouchableOpacity key={i} style={styles.item} onPress={() => { setSelected(s); setDropdownVisible(false); }}>
                                <View style={styles.itemContent}>
                                    <Image source={s.icon} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView style={{ flex: 1, backgroundColor: 'black' }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>
                            <Navbar dropdownVisible={dropdownVisible}  setDropdownVisible={setDropdownVisible} selected={selected} setSelected={setSelected} selectedSport={selectedSport} setSelectedSport={setSelectedSport} onOpenSettings={() => setSettingsVisible(true)}/>
                            
                            {filteredMatches.length === 0 ? (
                                <Text style={[styles.betsTitle, { paddingTop: 20 }]}>No matches currently available.</Text>
                            ) : (
                                filteredMatches.map((match) => {
                                    const bookmaker = match.bookmakers?.[0];
                                    const market = bookmaker?.markets?.[0];
                                    const team1 = market?.outcomes?.[0];
                                    const team2 = market?.outcomes?.[1];

                                    return market?.outcomes?.map((outcome: any, i: any) => {
                                        const [player, ...rest] = outcome.name.split(' ');
                                        const matchDate = new Date(match.commence_time).toLocaleDateString('en-GB');
                                        const odds = ((outcome.price - 1) * 100).toFixed(0);
                                        const percent = (((outcome.price - 1) * 100) / 100).toFixed(0);

                                        return (
                                            <View key={`${match.id}-${outcome.name}`} style={styles.betsContainer}>
                                                {/* Top Row */}
                                                <View style={styles.betsTopRow}>
                                                    <View style={styles.betsTitleWrapper}>
                                                        <Text style={styles.betsTitle}>
                                                        {match?.home_team ?? 'Home'} vs {match?.away_team ?? 'Away'}
                                                        </Text>
                                                    </View>
                                                    {team1 && team2 ? (
                                                        <View style={styles.statsContainer}>
                                                            <Text style={styles.pointsText}>+{((outcome.price - 1) * 100).toFixed(0)}</Text>
                                                            <View style={styles.percentContainer}>
                                                                <Text style={styles.percentText}>+{(((outcome.price - 1) * 100) / 100).toFixed(0)}%</Text>
                                                                <Fontisto name="arrow-up-l" size={16} style={styles.percentText} />
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <Text style={[styles.percentText, { color: 'white' }]}>Odds unavailable</Text>
                                                    )}
                                                </View>

                                                <View style={styles.betsUnderline} />

                                                {/* Description */}
                                                <Text style={styles.betsText}>
                                                    {outcome.name} in the game between {match.home_team} and {match.away_team} on{' '}
                                                    {new Date(match.commence_time).toLocaleDateString('en-GB')}.
                                                </Text>

                                                {/* Buttons */}
                                                <View style={styles.betsButtonContainer}>
                                                    <TouchableOpacity style={styles.notifyButton}>
                                                        <Text style={styles.betButtonsText}>Notify Me</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.betButton}>
                                                        <Text style={styles.betButtonsText}>Bet Now</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    });
                                })
                            )}
                            <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} countryFlag={countryFlag} showLogoutModal={() => { setSettingsVisible(false); setTimeout(() => setLogoutModalVisible(true), 50); }} showDeleteModal={() => { setSettingsVisible(false); setTimeout(() => setDeleteModalVisible(true), 50); }} />
                            <LogoutConfirmModal visible={logoutModalVisible} onCancel={() => setLogoutModalVisible(false)} onConfirm={() => { setLogoutModalVisible(false); handleLogout();}}/>
                            <DeleteConfirmModal visible={deleteModalVisible} onCancel={() => setDeleteModalVisible(false)} onConfirm={() => { setDeleteModalVisible(false); handleDeleteAccount();}}/>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
};

export default Main;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        alignItems: 'center',
    },
    betsContainer: {
        width: '90%',
        maxWidth: 500,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginTop: 20,
        backgroundColor: 'black',
    },
    betsTitle: {
        fontFamily: 'SFProDisplayBold',
        color: 'white',
        fontSize: 18,
    },
    betsText: {
        fontFamily: 'SFProDisplayRegular',
        color: 'white',
        fontSize: 14,
        lineHeight: 20,
    },
    betsUnderline: {
        bottom: -1,
        height: 1,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 1,
        marginBottom: 20
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pointsText: {
        color: 'black',
        fontFamily: 'DMSansBold',
        fontSize: 13,
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 9,
        paddingHorizontal: 15,
        lineHeight: 32,
    },
    percentText: {
        color: '#32F03A',
        fontFamily: 'DMSansLight',
        fontSize: 13,
    },
    percentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    betsTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    betsButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 15,
    },
    betsTitleWrapper: {
        flex: 1,
        marginRight: 12,
        marginBottom: 5, 
    },      
    notifyButton: {
        backgroundColor: '#8001FF',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    betButtonsText: {
        color: 'white',
        fontFamily: 'DMSansBold',
        fontSize: 14,
    },
    betButton: {
        backgroundColor: '#00B505',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    dropdownWrapper: {
        position: 'absolute',
        top: 140,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: 'rgba(128, 1, 255, 0.85)',
        borderRadius: 10,
        zIndex: 1000,
        width: 160,
        height: 390,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 12,
        alignItems: 'center',
    },       
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
    icon: {
        width: 140,
        height: 63,
        resizeMode: 'contain',
    },
    itemContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    partialBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
});
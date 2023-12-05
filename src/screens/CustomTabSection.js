import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native';

const CustomTabSection = ({ filteredClubs, renderItem }) => {
    const [selectedTab, setSelectedTab] = useState('Managed Club');

    const ManagerClubScreen = ({ clubs, renderItem }) => {
        return (<>
            <SectionList
                sections={[
                    {
                        data: clubs,
                    },
                ]}
                renderItem={renderItem}
                keyExtractor={(item) => item.post_id}
            />

        </>);
    }

    const SupportClubScreen = ({ clubs, renderItem }) => {
        return (<>
            <SectionList
                sections={[
                    {
                        data: clubs,
                    },
                ]}
                renderItem={renderItem}
                keyExtractor={(item) => item.post_id}
            />

        </>);
    }

    const renderContent = () => {
        switch (selectedTab) {
            case 'Managed Club':
                return filteredClubs.filter(item => item.role === 'manager')?.length > 0 ? (
                    <ManagerClubScreen clubs={filteredClubs.filter(item => item.role === 'manager')} renderItem={renderItem}></ManagerClubScreen>
                ) : (
                    <Text style={styles.notFound}>No Manager club found.</Text>
                );
            case 'Supported Club':
                return filteredClubs.filter(item => item.role === 'support')?.length > 0 ? (
                    <SupportClubScreen clubs={filteredClubs.filter(item => item.role === 'support')} renderItem={renderItem}></SupportClubScreen>
                ) : (
                    <Text style={styles.notFound}>No support club found.</Text>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'Managed Club' && styles.selectedTab]}
                    onPress={() => setSelectedTab('Managed Club')}
                >
                    <Text style={styles.tabText}>Managed Club</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'Supported Club' && styles.selectedTab]}
                    onPress={() => setSelectedTab('Supported Club')}
                >
                    <Text style={styles.tabText}>Supported Club</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>{renderContent()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%', // Adjust container width to take full width
    },
    tabContainer: {
        flexDirection: 'row',
        width: '100%', // Set tab container width to take full width
    },
    tab: {
        flex: 1, // Occupy equal space within the tab container
        padding: 10,
        borderBottomWidth: 2,
        borderColor: '#efefef',
        alignItems: 'center', // Align items at the center horizontally
    },
    selectedTab: {
        borderColor: '#2f8bff', // Change this to your desired selected tab color
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        width: '100%',
    },
    notFound: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default CustomTabSection;
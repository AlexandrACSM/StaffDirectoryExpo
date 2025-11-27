import React from 'react';
import { View, StyleSheet } from 'react-native';

// Simple tablet landscape frame (1024 x 768)
export default function TabletLayout({ children }) {
    return (
        <View style={styles.root}>
            <View style={styles.tabletFrame}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabletFrame: {
        width: 1024,
        height: 768,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 6,
        borderColor: '#333',
        overflow: 'hidden',
    },
});
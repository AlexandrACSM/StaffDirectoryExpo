// components/ScreenLayout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../styles/theme';

export default function ScreenLayout({ children }) {
    return (
        <View style={styles.root}>
            <View style={styles.phone}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // Whole browser page background
    root: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Simulated phone screen 390x800
    phone: {
        width: 390,
        height: 800,
        backgroundColor: colors.background,
        borderRadius: 32,
        paddingHorizontal: spacing.l,
        paddingTop: spacing.l,
        ...shadow.card,   // небольшая тень, как у телефона
    },
});

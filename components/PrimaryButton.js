import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../styles/theme';

export default function PrimaryButton({ title, onPress }) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius.m,
        paddingVertical: spacing.m,
        width: '100%',
        maxWidth: 350,     // Figma proportion
        alignSelf: 'center',
        marginTop: spacing.m,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
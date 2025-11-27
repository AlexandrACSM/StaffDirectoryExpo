import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

export default function TextField({
                                      label,
                                      placeholder,
                                      value,
                                      onChangeText,
                                      secureTextEntry,
                                      multiline,
                                  }) {
    return (
        <View style={styles.container}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <TextInput
                style={[styles.input, multiline && styles.multiline]}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.m,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: radius.m,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        fontSize: 16,
        color: colors.text,
        width: '100%',     // important
        maxWidth: 350,     // inside card we need little padding
    },
    multiline: {
        height: 90,
        textAlignVertical: 'top',
    },
});
// components/RequestCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../styles/theme';

export default function RequestCard({ request, children }) {
    return (
        <View style={styles.card}>
            <Text style={styles.type}>{request.type}</Text>
            <Text style={styles.comment}>{request.comment}</Text>
            <Text style={styles.meta}>Status: {request.status}</Text>
            <Text style={styles.meta}>Created: {request.createdAt}</Text>
            {children ? <View style={styles.actions}>{children}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: radius.l,
        padding: spacing.m,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow.card,
    },
    type: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    comment: {
        fontSize: 14,
        color: colors.text,
        marginBottom: spacing.s,
    },
    meta: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    actions: {
        marginTop: spacing.m,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.s,
    },
});

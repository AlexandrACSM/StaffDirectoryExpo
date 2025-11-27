import React, { useState, useEffect } from 'react'; // add useEffect
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import usersData from './data/users.json';
import {
    login,
    getUserRequests,
    getAllRequests,
} from './logic/logic';

import {
    fetchRequestsApi,
    createRequestApi,
    updateRequestStatusApi,
} from './api/requestsApi';


import ScreenLayout from './components/ScreenLayout';
import PrimaryButton from './components/PrimaryButton';
import TextField from './components/TextField';
import RequestCard from './components/RequestCard';
import { colors, spacing, radius } from './styles/theme';
import TabletLayout from './components/TabletLayout';
export default function App() {
    const [tabletMode, setTabletMode] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');

    const [requests, setRequests] = useState([]);
    const [requestType, setRequestType] = useState('');
    const [requestComment, setRequestComment] = useState('');

    // Load requests from json-server on start
    useEffect(() => {
        const loadRequests = async () => {
            try {
                const data = await fetchRequestsApi();
                setRequests(data);
            } catch (err) {
                console.log('Failed to load requests', err);
            }
        };

        loadRequests();
    }, []);

    // HR view state
    const [hrView, setHrView] = useState('dashboard'); // "dashboard" | "details" | "review"
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleLogin = () => {
        const user = login(username.trim(), password, usersData);

        if (user) {
            setCurrentUser(user);
            setError('');
            setHrView('dashboard');
            setSelectedRequest(null);
        } else {
            setError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setUsername('');
        setPassword('');
        setError('');
        setRequestType('');
        setRequestComment('');
        setHrView('dashboard');
        setSelectedRequest(null);
    };

    const handleCreateRequest = async () => {
        if (!currentUser) return;

        if (!requestType.trim() || !requestComment.trim()) {
            setError('Please enter request type and comment');
            return;
        }

        try {
            const newRequest = await createRequestApi({
                userId: currentUser.id,
                type: requestType.trim(),
                comment: requestComment.trim(),
            });

            setRequests([...requests, newRequest]);
            setRequestType('');
            setRequestComment('');
            setError('');
        } catch (err) {
            console.log('Failed to create request', err);
            setError('Failed to create request');
        }
    };





    const handleChangeStatus = async (id, status) => {
        try {
            const updated = await updateRequestStatusApi(id, status);

            setRequests((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r))
            );
        } catch (err) {
            console.log('Failed to update status', err);
        }
    };

    const allRequests = getAllRequests(requests);

    //  LOGIN SCREEN

    if (!currentUser) {
        return (
            <ScreenLayout>
                <View style={styles.centerWrapper}>
                    <View style={styles.card}>
                        <Text style={styles.appTitle}>Staff Directory</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>

                        <TextField
                            label="Username"
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <TextField
                            label="Password"
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <PrimaryButton title="Sign in" onPress={handleLogin} />
                    </View>
                </View>
            </ScreenLayout>
        );
    }

    //  EMPLOYEE DASHBOARD

    if (currentUser.role !== 'hr') {
        const userRequests = getUserRequests(currentUser.id, requests);

        return (
            <ScreenLayout>
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

                    <Text style={styles.headerTitle}>
                        Welcome, {currentUser.fullName}
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Employee dashboard
                    </Text>

                    {/* CREATE REQUEST BLOCK */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Create request</Text>

                        <TextField
                            label="Request type"
                            placeholder="Leave, Sick, Other"
                            value={requestType}
                            onChangeText={setRequestType}
                        />

                        <TextField
                            label="Comment"
                            placeholder="Short description"
                            value={requestComment}
                            onChangeText={setRequestComment}
                            multiline
                        />

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <PrimaryButton
                            title="Create request"
                            onPress={handleCreateRequest}
                        />
                    </View>

                    {/* MY REQUESTS BLOCK */}
                    <View style={[styles.card, { marginTop: 20 }]}>
                        <Text style={styles.sectionTitle}>My requests</Text>

                        {userRequests.length === 0 ? (
                            <Text style={styles.emptyText}>No requests yet.</Text>
                        ) : (
                            <ScrollView style={{ maxHeight: 300 }}>
                                {userRequests.map((req) => (
                                    <RequestCard key={req.id} request={req} />
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    {/* LOGOUT BUTTON */}
                    <View style={{ marginTop: 30 }}>
                        <PrimaryButton title="Logout" onPress={handleLogout} />
                    </View>

                </ScrollView>
            </ScreenLayout>
        );
    }

    //  HR SCREENS

    const renderHrDashboard = () => {
        const submittedCount = allRequests.filter(
            (r) => r.status === 'Submitted'
        ).length;
        const approvedCount = allRequests.filter(
            (r) => r.status === 'Approved'
        ).length;
        const rejectedCount = allRequests.filter(
            (r) => r.status === 'Rejected'
        ).length;

        const content = (
            <>
            <Text style={styles.headerTitle}>Welcome, {currentUser.fullName}</Text>
            <Text style={styles.headerSubtitle}>HR dashboard</Text>

            {/* Summary card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Requests summary</Text>
                <Text style={styles.metaText}>Total: {allRequests.length}</Text>
                <Text style={styles.metaText}>Submitted: {submittedCount}</Text>
                <Text style={styles.metaText}>Approved: {approvedCount}</Text>
                <Text style={styles.metaText}>Rejected: {rejectedCount}</Text>
            </View>

            {/* List card */}
            <View style={[styles.card, { marginTop: spacing.m }]}>
                <Text style={styles.sectionTitle}>All requests</Text>
                {allRequests.length === 0 ? (
                    <Text style={styles.emptyText}>No requests.</Text>
                ) : (
                    <ScrollView style={{ maxHeight: 420 }}>
                        {allRequests.map((req) => (
                            <RequestCard key={req.id} request={req}>
                                <View style={styles.hrButtonsRow}>
                                    <View style={styles.hrButton}>
                                        <PrimaryButton
                                            title="View details"
                                            onPress={() => {
                                                setSelectedRequest(req);
                                                setHrView('details');
                                            }}
                                        />
                                    </View>
                                </View>
                            </RequestCard>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.footer}>
                <PrimaryButton title="Logout" onPress={handleLogout} />
            </View>
            </>
        );

        if (tabletMode) {
            return (
                <TabletLayout>
                    {content}
                </TabletLayout>
            );
        }

        return (
            <ScreenLayout>
                {content}
            </ScreenLayout>
        );
    };

    const renderHrDetails = () => {
        if (!selectedRequest) {
            return renderHrDashboard();
        }

        return (
            <ScreenLayout>
                <Text style={styles.headerTitle}>Request details</Text>
                <Text style={styles.headerSubtitle}>
                    Request from user ID: {selectedRequest.userId}
                </Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{selectedRequest.type}</Text>
                    <Text style={styles.commentLabel}>Comment</Text>
                    <Text style={styles.commentValue}>{selectedRequest.comment}</Text>

                    <Text style={[styles.metaText, { marginTop: spacing.m }]}>
                        Status: {selectedRequest.status}
                    </Text>
                    <Text style={styles.metaText}>
                        Created: {selectedRequest.createdAt}
                    </Text>
                    <Text style={styles.metaText}>Request ID: {selectedRequest.id}</Text>
                </View>

                <View style={styles.hrButtonsRow}>
                    <View style={styles.hrButton}>
                        <PrimaryButton
                            title="Back to dashboard"
                            onPress={() => {
                                setSelectedRequest(null);
                                setHrView('dashboard');
                            }}
                        />
                    </View>
                    <View style={styles.hrButton}>
                        <PrimaryButton
                            title="Review request"
                            onPress={() => setHrView('review')}
                        />
                    </View>
                </View>
            </ScreenLayout>
        );
    };

    const renderHrReview = () => {
        if (!selectedRequest) {
            return renderHrDashboard();
        }

        const handleDecision = (status) => {
            handleChangeStatus(selectedRequest.id, status);
            setHrView('dashboard');
            setSelectedRequest(null);
        };

        return (
            <ScreenLayout>
                <Text style={styles.headerTitle}>Review request</Text>
                <Text style={styles.headerSubtitle}>
                    Decide whether to approve or reject this request.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{selectedRequest.type}</Text>
                    <Text style={styles.commentLabel}>Comment</Text>
                    <Text style={styles.commentValue}>{selectedRequest.comment}</Text>

                    <Text style={[styles.metaText, { marginTop: spacing.m }]}>
                        Current status: {selectedRequest.status}
                    </Text>
                    <Text style={styles.metaText}>
                        Created: {selectedRequest.createdAt}
                    </Text>
                    <Text style={styles.metaText}>Request ID: {selectedRequest.id}</Text>
                </View>

                <View style={styles.hrButtonsRow}>
                    <View style={styles.hrButton}>
                        <PrimaryButton
                            title="Approve"
                            onPress={() => handleDecision('Approved')}
                        />
                    </View>
                    <View style={styles.hrButton}>
                        <PrimaryButton
                            title="Reject"
                            onPress={() => handleDecision('Rejected')}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <PrimaryButton
                        title="Back without changes"
                        onPress={() => {
                            setHrView('details');
                        }}
                    />
                </View>
            </ScreenLayout>
        );
    };

    // Which HR screen to show
    if (hrView === 'details') {
        return renderHrDetails();
    }

    if (hrView === 'review') {
        return renderHrReview();
    }

    return renderHrDashboard();
}

const styles = StyleSheet.create({
    centerWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: radius.l,
        padding: spacing.l,
        borderWidth: 1,
        borderColor: colors.border,
        width: '100%',
        maxWidth: 390,
        alignSelf: 'center',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: spacing.s,
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.l,
    },
    errorText: {
        color: colors.error,
        marginTop: spacing.xs,
        marginBottom: spacing.s,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
    },
    headerSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.l,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.m,
        color: colors.text,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    row: {
        marginTop: spacing.m,
    },
    half: {
        marginBottom: spacing.m,
    },
    footer: {
        marginTop: spacing.l,
    },
    hrButtonsRow: {
        flexDirection: 'row',
        marginTop: spacing.m,
    },
    hrButton: {
        flex: 1,
        marginHorizontal: spacing.s / 2,
    },
    metaText: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    commentLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    commentValue: {
        fontSize: 16,
        color: colors.text,
    },
});

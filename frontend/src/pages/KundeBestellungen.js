import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';

const Container = styled.div`
  background: ${colors.background.paper};
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid ${colors.border};
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid ${colors.border};
`;

const Status = styled.span`
  padding: 6px 10px;
  border-radius: 12px;
  color: white;
  background: ${props => props.bg || '#777'};
  font-size: 0.9rem;
`;

const DEMO_ORDERS = [
    { id: 101, date: '2025-11-20', total: 29.50, status: 'Geliefert', items: 2 },
    { id: 102, date: '2025-11-22', total: 15.00, status: 'In Bearbeitung', items: 1 },
    { id: 103, date: '2025-11-24', total: 42.80, status: 'Storniert', items: 3 },
];

export default function KundeBestellungen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingDemo, setUsingDemo] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch('/api/kunde/bestellungen', { credentials: 'include' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (mounted) {
                    setOrders(Array.isArray(data) ? data : []);
                    setUsingDemo(false);
                }
            } catch (e) {
                // fallback to demo data
                if (mounted) {
                    setOrders(DEMO_ORDERS);
                    setUsingDemo(true);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <Container>
            <Title>Meine Bestellungen (Kundensicht)</Title>
            {usingDemo && (
                <div style={{ marginBottom: 12, color: '#b25', fontWeight: 600 }}>
                    Zeige Demo-Daten an - Laden der Bestellungen vom Server fehlgeschlagen
                </div>
            )}
            {loading ? (
                <div>Lade Bestellungen…</div>
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <Th>Bestell-Nr.</Th>
                            <Th>Datum</Th>
                            <Th>Positionen</Th>
                            <Th>Gesamt (€)</Th>
                            <Th>Status</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <Td>{o.id}</Td>
                                <Td>{o.date}</Td>
                                <Td>{o.items}</Td>
                                <Td>{o.total.toFixed(2)}</Td>
                                <Td><Status bg={statusColor(o.status)}>{o.status}</Status></Td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: 12, color: '#666' }}>
                                    Keine Bestellungen gefunden.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

function statusColor(status) {
  switch (status) {
    case 'geliefert': return '#4caf50';
    case 'unterwegs': return '#ff9800';
    case 'storniert': return '#f44336';
    default: return '#777';
  }
}

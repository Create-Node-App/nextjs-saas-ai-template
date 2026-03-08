import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import type { PersonDossier } from '../../services/person-dossier-service';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a2e',
    padding: 36,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #6366f1',
    paddingBottom: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#6366f1',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  meta: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#6366f1',
    borderBottom: '1pt solid #e2e8f0',
    paddingBottom: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#64748b',
    fontSize: 9,
    width: '30%',
  },
  value: {
    fontSize: 9,
    width: '70%',
  },
});

interface PersonProfilePDFDocumentProps {
  dossier: PersonDossier;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function PersonProfilePDFDocument({ dossier }: PersonProfilePDFDocumentProps) {
  const { person } = dossier;

  const fullName = `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim();
  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={`Profile — ${fullName}`} author="Agentic A8n Hub">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName || 'Unknown'}</Text>
          {person.title && <Text style={styles.subtitle}>{person.title}</Text>}
          <Text style={styles.meta}>Generated {generatedDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment</Text>
          <InfoRow label="Email" value={person.email} />
          <InfoRow label="Status" value={person.status} />
          <InfoRow label="Employment Type" value={person.employmentType} />
          <InfoRow label="Location" value={person.location} />
        </View>

        {person.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.6 }}>{person.bio}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

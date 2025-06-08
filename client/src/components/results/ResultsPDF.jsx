import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  section: {
    marginBottom: 20
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  column: {
    flexDirection: 'column',
    flex: 1
  },
  label: {
    fontSize: 10,
    color: '#666666',
    marginRight: 5
  },
  value: {
    fontSize: 12
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid'
  },
  skillName: {
    flex: 2,
    fontSize: 12
  },
  skillLevel: {
    flex: 1,
    fontSize: 12
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666666'
  }
});

// ResultsPDF component
const ResultsPDF = ({ results, developerRank, skillProgress }) => {
  // Format date for the report
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document title={`SkillLens Analysis - ${results?.fileName || 'Report'}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>SkillLens Analysis Report</Text>
          <Text style={styles.text}>Generated on: {formattedDate}</Text>
          {results?.fileName && (
            <Text style={styles.text}>Project: {results.fileName}</Text>
          )}
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Analysis Overview</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Analysis Date:</Text>
              <Text style={styles.value}>{results?.timestamp || formattedDate}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Analysis Type:</Text>
              <Text style={styles.value}>{results?.analysisType || 'Code Analysis'}</Text>
            </View>
          </View>
        </View>

        {/* Developer Rank Section (if available) */}
        {developerRank && (
          <View style={styles.section}>
            <Text style={styles.title}>Developer Profile</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Developer Rank:</Text>
                <Text style={styles.value}>{developerRank.rank || 'N/A'}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Complexity Score:</Text>
                <Text style={styles.value}>{developerRank.complexityScore || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Tech Diversity:</Text>
                <Text style={styles.value}>{developerRank.techDiversity || 'N/A'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Skills Section */}
        {results?.skills && results.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Skills Assessment</Text>
            
            {/* Skills Header */}
            <View style={styles.skillRow}>
              <Text style={[styles.skillName, { fontWeight: 'bold' }]}>Skill</Text>
              <Text style={[styles.skillLevel, { fontWeight: 'bold' }]}>Level</Text>
            </View>
            
            {/* Skills List */}
            {results.skills.slice(0, 15).map((skill, index) => (
              <View key={index} style={styles.skillRow}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>{skill.level}/10</Text>
              </View>
            ))}
            
            {results.skills.length > 15 && (
              <Text style={styles.text}>...and {results.skills.length - 15} more skills</Text>
            )}
          </View>
        )}

        {/* Skill Progress Section (if available) */}
        {skillProgress && (
          <View style={styles.section}>
            <Text style={styles.title}>Skill Progress</Text>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Frontend Average:</Text>
                <Text style={styles.value}>{skillProgress.frontendAvg || 'N/A'}/10</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Backend Average:</Text>
                <Text style={styles.value}>{skillProgress.backendAvg || 'N/A'}/10</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Overall Progress:</Text>
                <Text style={styles.value}>{skillProgress.overallProgress || 'N/A'}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recommendations Section */}
        {results?.recommendations && results.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Recommendations</Text>
            {results.recommendations.slice(0, 5).map((recommendation, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.subtitle}>{recommendation.title}</Text>
                <Text style={styles.text}>{recommendation.description}</Text>
              </View>
            ))}
            
            {results.recommendations.length > 5 && (
              <Text style={styles.text}>...and {results.recommendations.length - 5} more recommendations</Text>
            )}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by SkillLens • {formattedDate} • skillens.io
        </Text>
      </Page>
    </Document>
  );
};

export default ResultsPDF;

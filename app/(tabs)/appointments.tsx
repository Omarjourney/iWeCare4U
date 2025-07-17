import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin, Plus, ChevronRight } from 'lucide-react-native';

export default function Appointments() {
  const upcomingAppointments = [
    {
      id: 1,
      date: 'Jan 15, 2025',
      time: '10:00 AM',
      provider: 'Dr. Sarah Johnson',
      type: 'General Checkup',
      location: 'Main Clinic - Room 203',
      status: 'confirmed',
    },
    {
      id: 2,
      date: 'Jan 22, 2025',
      time: '2:30 PM',
      provider: 'Dr. Michael Chen',
      type: 'Cardiology Follow-up',
      location: 'Cardiology Center - Suite 401',
      status: 'pending',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      date: 'Jan 8, 2025',
      time: '9:00 AM',
      provider: 'Dr. Sarah Johnson',
      type: 'Lab Work',
      location: 'Lab Services - Floor 2',
      status: 'completed',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Schedule</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          {upcomingAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.dateTimeContainer}>
                  <Calendar size={16} color="#2563EB" />
                  <Text style={styles.dateText}>{appointment.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: appointment.status === 'confirmed' ? '#EBF4FF' : '#FEF3C7' }]}>
                  <Text style={[styles.statusText, { color: appointment.status === 'confirmed' ? '#2563EB' : '#D97706' }]}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.location}</Text>
                </View>
              </View>
              
              <View style={styles.appointmentFooter}>
                <View>
                  <Text style={styles.providerName}>{appointment.provider}</Text>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
                </View>
                <ChevronRight size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Appointments</Text>
          {pastAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={[styles.appointmentCard, styles.pastAppointment]}>
              <View style={styles.appointmentHeader}>
                <View style={styles.dateTimeContainer}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.pastDateText}>{appointment.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={[styles.statusText, { color: '#059669' }]}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.detailRow}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.detailText}>{appointment.location}</Text>
                </View>
              </View>
              
              <View style={styles.appointmentFooter}>
                <View>
                  <Text style={styles.pastProviderName}>{appointment.provider}</Text>
                  <Text style={styles.pastAppointmentType}>{appointment.type}</Text>
                </View>
                <ChevronRight size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pastAppointment: {
    opacity: 0.7,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  pastDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  pastProviderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  appointmentType: {
    fontSize: 14,
    color: '#6B7280',
  },
  pastAppointmentType: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
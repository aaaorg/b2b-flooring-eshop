<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">User Approval</div>

    <q-card>
      <q-card-section>
        <div class="row justify-between items-center q-mb-md">
          <div class="text-h6">Pending Approvals</div>
          <q-btn
            flat
            label="Refresh"
            icon="refresh"
            @click="loadUsers"
          />
        </div>

        <q-spinner v-if="loading" size="50px" color="primary" class="q-mt-md" />

        <div v-else-if="pendingUsers.length === 0" class="text-center q-pa-lg">
          <q-icon name="check_circle" size="64px" color="positive" />
          <div class="text-h6 text-grey-6 q-mt-md">No pending approvals</div>
          <p class="text-grey-6">All users are approved</p>
        </div>

        <q-table
          v-else
          :rows="pendingUsers"
          :columns="columns"
          row-key="id"
          flat
          hide-pagination
        >
          <template v-slot:body-cell-company="props">
            <q-td :props="props">
              {{ props.row.company?.name || 'N/A' }}
            </q-td>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                icon="check"
                color="positive"
                @click="approveUser(props.row)"
              >
                <q-tooltip>Approve</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                icon="close"
                color="negative"
                @click="rejectUser(props.row)"
              >
                <q-tooltip>Reject</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">All Users</div>

        <q-spinner v-if="loading" size="50px" color="primary" class="q-mt-md" />

        <q-table
          v-else
          :rows="allUsers"
          :columns="allUsersColumns"
          row-key="id"
          flat
          :pagination="pagination"
        >
          <template v-slot:body-cell-company="props">
            <q-td :props="props">
              {{ props.row.company?.name || 'N/A' }}
            </q-td>
          </template>

          <template v-slot:body-cell-isApproved="props">
            <q-td :props="props">
              <q-badge :color="props.row.isApproved ? 'positive' : 'warning'">
                {{ props.row.isApproved ? 'Approved' : 'Pending' }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-badge :color="getRoleColor(props.row.role)">
                {{ props.row.role.toUpperCase() }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                v-if="!props.row.isApproved"
                flat
                dense
                icon="check"
                color="positive"
                @click="approveUser(props.row)"
              >
                <q-tooltip>Approve</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                flat
                dense
                icon="block"
                color="warning"
                @click="rejectUser(props.row)"
              >
                <q-tooltip>Revoke Approval</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { adminService, type User } from '@/services/admin.service'
import { Notify } from 'quasar'
import { date } from 'quasar'

const allUsers = ref<User[]>([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10
})

const columns = [
  { name: 'fullName', label: 'Name', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'company', label: 'Company', field: 'company', align: 'left' },
  { name: 'createdAt', label: 'Registered', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

const allUsersColumns = [
  { name: 'fullName', label: 'Name', field: 'fullName', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'company', label: 'Company', field: 'company', align: 'left' },
  { name: 'role', label: 'Role', field: 'role', align: 'center', sortable: true },
  { name: 'isApproved', label: 'Status', field: 'isApproved', align: 'center', sortable: true },
  { name: 'createdAt', label: 'Registered', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

const pendingUsers = computed(() => {
  return allUsers.value.filter(user => !user.isApproved)
})

onMounted(() => {
  loadUsers()
})

async function loadUsers() {
  loading.value = true
  try {
    allUsers.value = await adminService.getUsers()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to load users',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

async function approveUser(user: User) {
  try {
    await adminService.approveUser(user.id)
    Notify.create({
      type: 'positive',
      message: `User ${user.fullName} approved successfully`,
      position: 'top'
    })
    loadUsers()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to approve user',
      position: 'top'
    })
  }
}

async function rejectUser(user: User) {
  try {
    await adminService.rejectUser(user.id)
    Notify.create({
      type: 'positive',
      message: user.isApproved ? 'User approval revoked' : 'User rejected',
      position: 'top'
    })
    loadUsers()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to reject user',
      position: 'top'
    })
  }
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    'admin': 'deep-purple',
    'sales': 'blue',
    'customer': 'primary'
  }
  return colors[role] || 'grey'
}

function formatDate(dateString: string): string {
  return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm')
}
</script>

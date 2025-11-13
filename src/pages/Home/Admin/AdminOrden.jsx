import React from 'react'
import AdminLayout from '../../../componentes/Usuario/Administrador/AdminLayout/AdminLayout.jsx'
import OrdersList from '../../../componentes/Usuario/Administrador/AdminOrder/OrdersList.jsx'

export default function AdminOrden(){
	return (
		<AdminLayout>
			<div style={{paddingTop: 10}}>
				<OrdersList />
			</div>
		</AdminLayout>
	)
}

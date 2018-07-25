/**
 * The default set of translated pieces of text indexed by locale.
 * Values from window.__cmp.config.localization will override these
 * per locale.  Empty values will use the english value provided
 * inline in each component.
 */
export default {
	en: {
		banner: {
			title: '',
			description: '',
			links: {
				data: {
					title: '',
					description: ''
				},
				purposes: {
					title: '',
					description: ''
				},
				manage: '',
				accept: ''
			}
		},
		summary: {
			title: '',
			description: '',
			who: {
				title: '',
				description: ''
			},
			what: {
				title: '',
				description: ''
			}
		},
		details: {
			back: '',
			save: ''
		},
		purposes: {
			title: '',
			description: '',
			back: '',
			optoutdDescription: ``,
			purpose1: {
				description: `Allow storing or accessing information on a user's device.`
			},
			purpose2: {
				description: `Allow processing of a user's data to provide and inform personalised advertising (including delivery, measurement, and reporting) based on a user's preferences or interests known or inferred from data collected across multiple sites, apps, or devices; and/or accessing or storing information on devices  for that purpose.
				Will include following Features:
				<ul>
					<li>Matching Data to Offline Sources - combining data from offline sources that were initially collected in other contexts.</li>
					<li>Linking Devices - allow processing of a user's data to connect such user across multiple devices.</li>
					<li>Precise Geographic Location data - allow processing of a user's precise geographic location data in support of a purpose for which that certain third party has consent.</li>
				</ul>`
			},
			purpose3: {
				description: `Allow processing of a user's data to deliver content or advertisements and measure the delivery of such content or advertisements, extract insights and generate reports to understand service usage; and/or accessing or storing information on devices for that purpose.
				Will include following Features:
				<ul>
					<li>Matching Data to Offline Sources - combining data from offline sources that were initially collected in other contexts.</li>
					<li>Linking Devices - allow processing of a user's data to connect such user across multiple devices.</li>
					<li>Precise Geographic Location data - allow processing of a user's precise geographic location data in support of a purpose for which that certain third party has consent.</li>
				</ul>`
			},
			purpose4: {
				description: `Allow processing of a user's data to provide and inform personalised content (including delivery, measurement, and reporting) based on a user's preferences or interests known or inferred from data collected across multiple sites, apps, or devices; and/or accessing or storing information on devices for that purpose.
				Will include following Features:
				<ul>
					<li>Matching Data to Offline Sources - combining data from offline sources that were initially collected in other contexts.</li>
					<li>Linking Devices - allow processing of a user's data to connect such user across multiple devices.</li>
					<li>Precise Geographic Location data - allow processing of a user's precise geographic location data in support of a purpose for which that certain third party has consent.</li>
				</ul>`
			}
		},
		vendors: {
			title: '',
			description: '',
			accept: '',
			acceptAll: '',
			optOut: '',
			back : ''
		}
	},
	es: {
		banner: {
			title: 'Uso de cookies',
			description: 'Utilizamos "cookies" propias y de terceros para elaborar información estadística y mostrarle publicidad personalizada a través del análisis de su navegación. Si continúa navegando acepta su uso.',
			links: {
				data: {
					title: 'Titulo de data',
					description: 'Esta seria la descripcion'
				},
				purposes: {
					title: 'Titulo de purposes',

					description: ''
				},
				manage: 'Leer más',
				accept: 'Aceptar'
			}
		},
		details: {
			title: 'configuración de privacidad',
			back: 'Atrás',
			save: 'Guardar y salir'
		},
		summary: {
			title: 'Obtenga más información sobre cómo se usa la información.',
			description: 'Nosotros y algunas empresas selectas podemos acceder y usar su información para los siguientes propósitos. Puede personalizar sus opciones a continuación o continuar usando nuestro sitio si está de acuerdo con los propósitos.',
			detailLink: 'Más información',
			who:{
				title:'¿Quién está usando esta información?',
				description:'Nosotros y las compañías preseleccionadas usaremos su información. Puede ver cada empresa en los enlaces de arriba o',
				link:'mira la lista completa aquí.'
			},
			what:{
				title:'¿Qué información está siendo utilizada?',
				description:'Diferentes compañías usan información diferente,',
				link:'mira la lista completa aquí.'
			}
		},
		purposes: {
			title: 'Datos recolectados',
			description: 'A continuación se muestra la lista de datos que se pueden recopilar:',
			back: 'Configura cómo se usan estos datos',
			optoutdDescription: 'Dependiendo del tipo de datos que recopilan, usan y procesan, y otros factores, incluida la privacidad por diseño, ciertos socios confían en su consentimiento, mientras que otros requieren que se excluya. Para obtener información sobre cada proveedor y ejercer sus elecciones, consulte a continuación. O para optar por no participar, visite los sitios de NAI, DAA o EDAA.',
			items: `<ul>
						<li>Tipo y configuración del navegador</li>
						<li>Información del sistema operativo</li>
						<li>Datos de cookies</li>
						<li>Información sobre el dispositivo utilizado</li>
						<li>La dirección IP desde la que el dispositivo accede al sitio web</li>
						<li>Información sobre la actividad del usuario en este dispositivo, incluidas las páginas web visitadas</li>
						<li>Información de geolocalización del dispositivo al acceder al sitio web</li>
					</ul>`,
			purpose1: {
				menu: 'Almacenamiento y acceso a la información',
				title: 'Almacenamiento y acceso a la información',
				description: 'El almacenamiento y acceso a la información que ya está almacenada en su dispositivo, como identificadores publicitarios, identificadores de dispositivos, cookies y tecnologías similares.'
			},
			purpose2: {
				menu: 'Personalización',
				title: 'Personalización',
				description: 'La recopilación y el procesamiento de información para personalizar posteriormente la publicidad y/o contenidos para usted, como en otros sitios web o aplicaciones, a lo largo del tiempo. Normalmente, la selección futura de publicidad y/o contenido.'
			},
			purpose3: {
				menu: 'Selección de anuncios, entregas, informes',
				title: 'Selección de anuncios, entregas, informes',
				description: 'Recopilación de información y combinación de información recopilada previamente, para seleccionar y entregar anuncios para usted, medir la entrega y la efectividad de dichos anuncios. Esto incluye el uso de información recopilada previamente sobre sus intereses para seleccionar anuncios, procesar datos sobre qué publicidades se mostraron, con qué frecuencia se mostraron, cuándo y dónde se mostraron y si tomó alguna medida relacionada con el anuncio, incluyendo, por ejemplo, clicks sobre los anuncios o compras. Esto no incluye la personalización, que es la recopilación y el procesamiento de la información sobre el uso de este servicio para personalizar posteriormente la publicidad y / o contenido en otros contextos, como sitios web o aplicaciones, a lo largo del tiempo.'

			},
			purpose4: {
				menu: 'Selección de contenido, entrega, informes',
				title: 'Selección de contenido, entrega, informes',
				description: 'Recopilación de información, y combinación con información recopilada previamente, para seleccionar y entregar contenido para usted, y para medir la entrega y la efectividad de dicho contenido. Esto incluye el uso de información recopilada anteriormente sobre sus intereses para seleccionar contenido, procesar datos sobre qué contenido se mostró, con qué frecuencia o durante cuánto tiempo se mostró, cuándo y dónde se mostró y si realizó alguna acción relacionada con el contenido, incluyendo por ejemplo, clicks sobre el contenido. Esto no incluye la personalización, que es la recopilación y el procesamiento de la información sobre el uso de este servicio para personalizar posteriormente el contenido y / o publicidad en otros contextos, como sitios web o aplicaciones, a lo largo del tiempo.'

			},
			purpose5: {
				menu: 'Medición',
				title: 'Medición',
				description: 'Recopilación de información sobre su uso del contenido y la combinación con información recopilada anteriormente, utilizada para medir, comprender e informar sobre el uso que hace del servicio. Esto no incluye la personalización, la recopilación de información sobre el uso de este servicio para personalizar posteriormente el contenido y / o la publicidad en otros contextos, es decir, en otros servicios, como sitios web o aplicaciones, a lo largo del tiempo.'

			},
		},
		vendors: {
			title: 'Nuestros Partners',
			description: 'Ayúdenos a ofrecerle un mejor servicio. Nuestros socios utilizan las cookies de su navegador para comprender, a través de la web, lo que le interesa y para ofrecerle contenido y publicidad relevantes.',
			accept: 'Aceptar',
			acceptAll: 'Aceptar todo',
			optOut: 'Opt-out',
			back : 'Atrás'
		}
	}
};

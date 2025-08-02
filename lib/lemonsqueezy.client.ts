									  

export const STORE_ID = process.env.NEXT_PUBLIC_LS_STORE_ID!
if (!STORE_ID) throw new Error('Missing NEXT_PUBLIC_LS_STORE_ID')

export const VARIANT_LINK_IDS = {
  starter: {
    monthly:  '3da07d0e-8b89-4986-a590-e414dc64958c',
    yearly:   '3745e74b-307e-4f3f-90c1-4ce7b2826a77'
  },
  professional: {
    monthly:  '97043936-f85c-48b7-9345-2e81631cabda',
    yearly:   '204edcdf-71cb-4fd0-afe0-a26d83d9d1f8'
  }
} as const

												  
for (const plan of ['starter', 'professional'] as const) {
  for (const interval of ['monthly', 'yearly'] as const) {
    if (!VARIANT_LINK_IDS[plan][interval]) {
					  
      throw new Error(`Missing VARIANT_LINK_IDS[${plan}][${interval}]`)
	   
    }
  }
}

import StoreCard from '../StoreCard'

export default function StoreCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StoreCard
        id="1"
        name="Downtown Electronics Store"
        address="123 Main Street, Downtown"
        averageRating={4.5}
        userRating={5}
        onRate={(id) => console.log('Rate store:', id)}
      />
      <StoreCard
        id="2"
        name="Westside Fashion Boutique"
        address="456 Fashion Avenue, West Side"
        averageRating={3.8}
        onRate={(id) => console.log('Rate store:', id)}
      />
    </div>
  )
}

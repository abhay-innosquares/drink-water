import WaterNotifier from "@/components/water-notifier"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-8 text-center">Drink Water Reminder</h1>
      <WaterNotifier />
    </main>
  )
}


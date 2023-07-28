<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';

  export let selectedCard;
  export let setSelectedCard;

  let searchQuery = '';
  let showModal = false;
  let newCardData = { model: '', price: '' };

  function handleAddCard() {
    // Make sure the newCardData is not empty before adding
    if (newCardData.model && newCardData.price) {
      setSelectedCard(prev => ({
        ...prev,
        data2: [...prev.data2, { ...newCardData }],
      }));

      // Reset the modal state and new card data
      showModal = false;
      newCardData = { model: '', price: '' };
    }
  }

  // Save the selected card data to local storage on change
  $: if (selectedCard) {
    sessionStorage.setItem('selectedCard', JSON.stringify(selectedCard));
  }

  // Use onMount lifecycle event to retrieve the selected card data from local storage on page load
  onMount(() => {
    const storedSelectedCard = sessionStorage.getItem('selectedCard');
    if (storedSelectedCard) {
      setSelectedCard(JSON.parse(storedSelectedCard));
    }
  });
</script>

<div class="w-full bg-gray-100 p-4">
  <Link to="/content">
    <button class="mb-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center">
      Expand
    </button>
  </Link>
  {#if selectedCard}
    <h1 class="text-xl mb-4 font-semibold">Selected Card: {selectedCard.name}</h1>

    <button on:click={() => showModal = true} class="bg-green-500 text-white px-4 py-2 rounded">
  Add New Card
</button>

    <!-- Display the list of nested data (data2) -->
    <!-- Implement your nested data display based on your preference -->

    <input
      type="text"
      placeholder="Search nested data..."
      bind:value={searchQuery}
      class="w-full p-2 mb-4 rounded"
    />

  {#if selectedCard.data2 && selectedCard.data2.length > 0}
  {#each selectedCard.data2.filter(nestedData =>
    nestedData.model.toLowerCase().includes(searchQuery.toLowerCase())
  ) as nestedData, index}
    <div key={index} class="bg-gray-300 p-2 mb-2">
      <h2 class="font-semibold">{nestedData.model}</h2>
      <p class="text-sm">{nestedData.price}</p>
    </div>
  {/each}
{:else}
  <p>No nested data found.</p>
{/if}

    <!-- Implement your filter and add new cards functionalities here -->
  {:else}
    <p class="text-xl">Select a card from the sidebar to view its details.</p>
  {/if}
 {#if showModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded w-80">
        <h2 class="text-xl font-semibold mb-2">Add New Card</h2>
        <input
          type="text"
          placeholder="Model"
          bind:value={newCardData.model}
          class="w-full p-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Price"
          bind:value={newCardData.price}
          class="w-full p-2 mb-2 rounded"
        />
        <button on:click={handleAddCard} class="bg-green-500 text-white px-4 py-2 rounded">
          Add
        </button>
        <button
          on:click={() => showModal = false}
          class="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
</div>
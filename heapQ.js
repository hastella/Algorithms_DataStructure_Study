// OO 조선소에서는 태풍으로 인한 작업지연으로 수주한 선박들을 기한 내에 완성하지 못할 것이 예상됩니다. 기한 내에 완성하지 못하면 손해 배상을 해야 하므로 남은 일의 작업량을 숫자로 매기고 배상비용을 최소화하는 방법을 찾으려고 합니다.
// 배상 비용은 각 선박의 완성까지 남은 일의 작업량을 제곱하여 모두 더한 값이 됩니다.
//
// 조선소에서는 1시간 동안 남은 일 중 하나를 골라 작업량 1만큼 처리할 수 있습니다. 조선소에서 작업할 수 있는 N 시간과 각 일에 대한 작업량이 담긴 배열(works)이 있을 때 배상 비용을 최소화한 결과를 반환하는 함수를 만들어 주세요. 예를 들어, N=4일 때, 선박별로 남은 일의 작업량이 works = [4, 3, 3]이라면 배상 비용을 최소화하기 위해 일을 한 결과는 [2, 2, 2]가 되고 배상 비용은 2^2 + 2^2 + 2^2 = 12가 되어 12를 반환해 줍니다.

// 문제 유형 파악하기
// 문제 설명 중 핵심 부분은 역시 배상 비용을 계산하는 부분입니다. 배상 비용은 각 요소를 제곱하게 되므로 최대한 각 요소를 골고루 처리하는 것이 가장 배상 비용을 최소화 할 수 있는 방법입니다.
//
// 그러기 위해서는 매 루프마다 가장 큰 작업을 찾아서 처리해야 합니다. 이때 가장 큰 작업을 찾기 위한 방법은 3가지가 있습니다.
//
// 매 루프마다 Math.max 함수를 호출한다.
// 매 루프마다 정렬한다.
// Heap을 이용한다.
// 1번은 매 루프마다 O(n) 시간복잡도가 소요됩니다. 2번은 O(n log n)이 소요됩니다. 반면 Heap을 이용하면 O(log n)만이 소요됩니다.
//
// 사실 매번 큰 값 혹은 작은 값을 알아야 한다면 무조건 Heap을 사용하는 것이 좋습니다.

// 최대 힙 구현
// 가장 큰 값을 알기 위해선 최대 힙을 구현해야 합니다.

class MaxHeap {
  constructor() {
    this.heap = [null];
  }

  push(value) {
    this.heap.push(value); // 힙의 마지막에 요소를 추가
    let currentIndex = this.heap.length - 1; // 추가된 요소의 인덱스
    let parentIndex = Math.floor(currentIndex / 2); // 추가된 요소의 부모 인덱스

    while (parentIndex !== 0 && this.heap[parentIndex] < value) {
      // 부모 요소가 존재하고, 부모 요소가 추가된 요소보다 작을 때
      const temp = this.heap[parentIndex]; // 부모 요소와 추가된 요소를 교체
      this.heap[parentIndex] = value;
      this.heap[currentIndex] = temp;

      currentIndex = parentIndex; // 추가된 요소의 인덱스를 부모 인덱스로 변경
      parentIndex = Math.floor(currentIndex / 2); // 부모 요소의 인덱스를 다시 계산
    }
  }

  pop() {
    if (this.heap.length === 2) return this.heap.pop(); // 루트 정점만 남은 경우

    const returnValue = this.heap[1]; // 반환할 값을 저장
    this.heap[1] = this.heap.pop(); // 마지막 요소를 루트로 변경

    let currentIndex = 1; // 현재 인덱스
    let leftIndex = 2; // 왼쪽 자식 인덱스
    let rightIndex = 3; // 오른쪽 자식 인덱스

    while (
      this.heap[currentIndex] < this.heap[leftIndex] || // 왼쪽 자식이 존재하고, 왼쪽 자식이 현재 요소보다 클 때
      this.heap[currentIndex] < this.heap[rightIndex]
    ) {
      // 오른쪽 자식이 존재하고, 오른쪽 자식이 왼쪽 자식보다 클 때
      if (this.heap[leftIndex] < this.heap[rightIndex]) {
        // 왼쪽 자식이 오른쪽 자식보다 작을 때
        const temp = this.heap[currentIndex]; // 현재 요소와 왼쪽 자식 요소를 교체
        this.heap[currentIndex] = this.heap[rightIndex];
        this.heap[rightIndex] = temp;
        currentIndex = rightIndex;
      } else {
        const temp = this.heap[currentIndex];
        this.heap[currentIndex] = this.heap[leftIndex];
        this.heap[leftIndex] = temp;
        currentIndex = leftIndex;
      }
      leftIndex = currentIndex * 2;
      rightIndex = currentIndex * 2 + 1;
    }
    return returnValue;
  }
}

// 힙을 이용한 문제 풀이
function solution(no, works) {
  // 모든 작업의 합보다 no가 크면 배상 비용을 낼 필요가 없다.
  if (works.reduce((a, b) => a + b) <= no) {
    return 0;
  }

  // max heap 구성
  const heap = new MaxHeap();
  for (const work of works) {
    heap.push(work);
  }

  // no만큼 루프 돌면서 가장 큰 값을 빼서 처리 후 다시 push
  for (let i = 0; i < no; i += 1) {
    heap.push(heap.pop() - 1);
  }

  // 남은 요소에 제곱한 값들의 합을 구한 후 반환
  return heap.heap.reduce((a, b) => a + b * b);
}

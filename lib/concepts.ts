export type Course = 'algorithm' | 'java'

export interface Concept {
  id: string
  name: string
  description: string
  course: Course
}

export interface ConceptEdge {
  from: string
  to: string
  label: string
}

export const concepts: Concept[] = [
  { id: 'time-complexity', name: '시간복잡도', description: 'Big-O 표기법과 알고리즘 효율성 분석', course: 'algorithm' },
  { id: 'sorting', name: '정렬', description: '버블, 선택, 삽입, 퀵, 병합 정렬 비교', course: 'algorithm' },
  { id: 'binary-search', name: '이진탐색', description: '정렬된 배열에서 O(log n) 탐색', course: 'algorithm' },
  { id: 'recursion', name: '재귀', description: '함수가 자기 자신을 호출하는 기법', course: 'algorithm' },
  { id: 'dynamic-programming', name: '동적프로그래밍', description: '메모이제이션으로 중복 계산 제거', course: 'algorithm' },
  { id: 'graph-traversal', name: '그래프탐색', description: 'BFS와 DFS로 그래프 순회', course: 'algorithm' },
  { id: 'oop', name: '객체지향', description: '캡슐화, 상속, 다형성, 추상화 4대 원칙', course: 'java' },
  { id: 'inheritance', name: '상속·인터페이스', description: 'extends, implements, 추상클래스', course: 'java' },
  { id: 'collections', name: '컬렉션', description: 'List, Set, Map 인터페이스와 구현체', course: 'java' },
  { id: 'exception', name: '예외처리', description: 'try-catch-finally, Checked/Unchecked', course: 'java' },
  { id: 'generics', name: '제네릭', description: '타입 파라미터로 타입 안전성 확보', course: 'java' },
  { id: 'threading', name: '스레드', description: '동시성, synchronized, 데드락', course: 'java' },
]

export const edges: ConceptEdge[] = [
  { from: 'time-complexity', to: 'sorting', label: '분석 기준' },
  { from: 'time-complexity', to: 'binary-search', label: '분석 기준' },
  { from: 'recursion', to: 'sorting', label: '퀵/병합정렬' },
  { from: 'recursion', to: 'dynamic-programming', label: '기반 기법' },
  { from: 'sorting', to: 'binary-search', label: '전제 조건' },
  { from: 'graph-traversal', to: 'dynamic-programming', label: '응용' },
  { from: 'oop', to: 'inheritance', label: '핵심 원칙' },
  { from: 'oop', to: 'collections', label: '활용' },
  { from: 'inheritance', to: 'generics', label: '타입 확장' },
  { from: 'generics', to: 'collections', label: '타입 안전성' },
  { from: 'exception', to: 'threading', label: '동시성 처리' },
]

export const courses = {
  algorithm: { name: '알고리즘실무', color: '#0E7AA4' },
  java: { name: '자바프로그래밍', color: '#0f766e' },
}

export function getConceptById(id: string) {
  return concepts.find(c => c.id === id)
}

export function getConceptsByCoure(course: Course) {
  return concepts.filter(c => c.course === course)
}

export function getRelatedConcepts(conceptId: string) {
  const related: { concept: Concept; direction: 'to' | 'from'; label: string }[] = []
  for (const edge of edges) {
    if (edge.from === conceptId) {
      const c = getConceptById(edge.to)
      if (c) related.push({ concept: c, direction: 'to', label: edge.label })
    }
    if (edge.to === conceptId) {
      const c = getConceptById(edge.from)
      if (c) related.push({ concept: c, direction: 'from', label: edge.label })
    }
  }
  return related
}

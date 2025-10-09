import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/lib/firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica dos dados obrigatórios
    if (!body.league || !body.teams || !body.matchTime || !body.prediction) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Preparar dados para salvar no Firestore
    const tipData = {
      category: body.category || "football",
      league: body.league,
      teams: body.teams,
      matchTime: body.matchTime,
      prediction: body.prediction,
      confidence: body.confidence || 0,
      isPremium: body.isPremium || false,
      description: body.description || "",
      odds: body.odds || [],
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Salvar no Firestore
    const docRef = await addDoc(collection(db, "tips"), tipData);

    return NextResponse.json(
      { 
        success: true, 
        id: docRef.id,
        message: "Palpite criado com sucesso!" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro ao criar palpite:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do palpite é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o palpite existe
    const tipRef = doc(db, "tips", id);
    const tipSnap = await getDoc(tipRef);

    if (!tipSnap.exists()) {
      return NextResponse.json(
        { error: "Palpite não encontrado" },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    const updatedData = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Atualizar no Firestore
    await updateDoc(tipRef, updatedData);

    return NextResponse.json(
      { 
        success: true, 
        message: "Palpite atualizado com sucesso!" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao atualizar palpite:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
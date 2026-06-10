package bdom.kikwit.Services;

import bdom.kikwit.Dto.UtilisateurRequestDto;
import bdom.kikwit.Dto.UtilisateurResponseDto;

import java.io.IOException;
import java.util.List;

public interface UtilisateurService {
    UtilisateurResponseDto save(UtilisateurRequestDto requestDto) throws IOException;
    UtilisateurResponseDto getOne(Long id);
    List<UtilisateurResponseDto> list();
    UtilisateurResponseDto update(Long id,UtilisateurRequestDto requestDto);
    String delete(Long id);
}
